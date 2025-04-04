from flask import Blueprint, jsonify, current_app, Response
import numpy as np
import cv2
import face_recognition
from ultralytics import YOLO
import threading
import queue
import torch
from app.configuration.exts import db  
from app.modele.model_members import Members
from app.modele.model_events import Event
from app.modele.model_presence import Presence
from app.modele.model_absence import Absence
from app.modele.model_groups import Groups
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
import time
import logging
from pathlib import Path

recognition_bp = Blueprint('recognition', __name__)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
current_path = Path.cwd()
model_path = current_path / "app" / "controlleur" / "yolov8n-face.pt"
cap_lock = threading.Lock()

try:
    model = YOLO(str(model_path))
    model.to(device)
    model.overrides['verbose'] = False
except Exception as e:
    logger.error(f"Erreur chargement modèle YOLO: {e}")
    model = None

class ReconnaissanceManager:
    def __init__(self):
        self.output_resolution = (720, 480)
        self.known_encodings = []
        self.known_names = []
        self.active_events = {}
        self.stopped_events = {}
        self.stop_flags = {}
        self.frame_queue = queue.Queue(maxsize=5)
        self.processed_frame = None
        self.processing_lock = threading.Lock()
        self.cap = cv2.VideoCapture()
        self.member_cache = {}
        self.batch_size = 6
        self.frame_skip = 10

    def generate_stream(self):
      
        frame_count = 0
        while True:
            with self.processing_lock:
                if self.processed_frame is not None:
                    try:
                        frame_count += 1
                        if frame_count % self.frame_skip != 0:
                            continue
                            
                        _, buffer = cv2.imencode('.jpg', self.processed_frame)
                        yield (b'--frame\r\n'
                               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
                    except Exception as e:
                        logger.error(f"Stream error: {e}")
                else:
                    time.sleep(0.05)

    def load_members(self):
       
        self.known_encodings.clear()
        self.known_names.clear()
        
        with current_app.app_context():
            members = Members.query.yield_per(100)
            
            for member in members:
                if not member.Image:
                    continue
                    
                try:
                    img_array = np.frombuffer(member.Image, np.uint8)
                    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                    if img is None:
                        continue
                        
                    small_img = cv2.resize(img, (0,0), fx=0.4, fy=0.4)
                    rgb_img = cv2.cvtColor(small_img, cv2.COLOR_BGR2RGB)
                    
                    face_locs = face_recognition.face_locations(rgb_img, model="hog")
                    if not face_locs:
                        continue
                        
                    encoding = face_recognition.face_encodings(rgb_img, face_locs)[0]
                    full_name = f"{member.Name} {member.First_name}"
                    
                    self.known_encodings.append(encoding)
                    self.known_names.append(full_name)
                    self.member_cache[full_name] = member
                    
                except Exception as e:
                    logger.error(f"Member {member.id} processing error: {e}")

    def process_frames(self, event_id, app):
        with app.app_context():
            event = Event.query.get(event_id)
            if not event:
                return
                
            frame_counter = 0
            
            while not self.stop_flags.get(event_id, False):
                if self.frame_queue.empty():
                    time.sleep(0.01)
                    continue
                    
                frame = self.frame_queue.get()
                frame_counter += 1
                
                if frame_counter % self.frame_skip != 0:
                    continue
                    
                try:
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    
                    results = model(frame, imgsz=256, verbose=False)
                    faces = results[0].boxes
                    
                    for face in faces:
                        x1, y1, x2, y2 = map(int, face.xyxy[0])
                        face_img = frame_rgb[y1:y2, x1:x2]
                        
                        if face_img.size == 0:
                            continue
                            
                        encodings = face_recognition.face_encodings(
                            frame_rgb, 
                            [(y1, x2, y2, x1)],
                            num_jitters=1
                        )
                        
                        if encodings:
                            matches = face_recognition.compare_faces(
                                self.known_encodings,
                                encodings[0],
                                tolerance=0.7
                            )
                            
                            if True in matches:
                                match_idx = matches.index(True)
                                name = self.known_names[match_idx]
                                color = (0, 255, 0)
                                
                                self.handle_presence(event, name)
                            else:
                                name = "Inconnu"
                                color = (0, 0, 255)
                                
                            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                            cv2.putText(frame, name, (x1, y1-10), 
                                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)
                                       
                    with self.processing_lock:
                        self.processed_frame = frame
                        
                except Exception as e:
                    logger.error(f"Frame processing error: {e}")

    def handle_presence(self, event, full_name):
        if full_name not in self.member_cache:
            return
            
        member = self.member_cache[full_name]
        
        try:
            exists = db.session.query(
                Presence.query.filter_by(
                    Id_event=event.id,
                    Id_member=member.id
                ).exists()
            ).scalar()
            
            if not exists:
                db.session.add(Presence(
                    Id_event=event.id,
                    Id_member=member.id
                ))
                db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"DB error: {e}")

    def start_capture(self):
        self.cap.open("http://192.168.1.171:8080/video")
        if not self.cap.isOpened():
            logger.error("Failed to open video stream")
            return
            
        while True:
            ret, frame = self.cap.read()
            if not ret:
                logger.warning("Video stream read error")
                break
                
            if not self.frame_queue.full():
                self.frame_queue.put(frame)
                
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
        self.cap.release()
        cv2.destroyAllWindows()

recognition_manager = ReconnaissanceManager()

@recognition_bp.route('/start_event/<int:event_id>', methods=['POST'])
def start_event(event_id):
    with current_app.app_context():
        event = Event.query.get(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404
            
        if event_id in recognition_manager.active_events:
            return jsonify({"message": "Event already running"}), 200
       
        recognition_manager.load_members()
        
        app = current_app._get_current_object()
        threading.Thread(
            target=recognition_manager.process_frames,
            args=(event_id, app),
            daemon=True
        ).start()
        
        threading.Thread(
            target=recognition_manager.start_capture,
            daemon=True
        ).start()
        
        recognition_manager.active_events[event_id] = {
            "start_time": datetime.now(),
            "status": "running"
        }
        
        return jsonify({
            "message": f"Event {event.Name_event} started",
            "status": "success"
        }), 200

@recognition_bp.route('/stop_event/<int:event_id>', methods=['POST'])
def stop_event(event_id):
   
    with current_app.app_context():
        event = Event.query.get(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404
            
        recognition_manager.stop_flags[event_id] = True
        recognition_manager.stopped_events[event_id] = {
            "stop_time": datetime.now(),
            "status": "stopped"
        }
        
        if recognition_manager.cap.isOpened():
            recognition_manager.cap.release()
        cv2.destroyAllWindows()
        
        def process_absences_with_app_context():
            with current_app.app_context():
                try:
                    process_absences_background()
                except Exception as e:
                    print(f"Error in processing absences: {e}")

        thread = threading.Thread(target=process_absences_with_app_context)
        thread.start()
        
        return jsonify({
            "message": f"Event {event.Name_event} stopped",
            "status": "success"
        }), 200
        
def process_absences_background(event_id):
    with current_app.app_context():
        try:
            event = Event.query.get(event_id)
            if not event:
                return
                
            absent_members = find_absent_members(event)
            if absent_members:
                db.session.bulk_insert_mappings(Absence, absent_members)
                db.session.commit()
        except Exception as e:
            db.session.rollback()
            logger.error(f"Absence processing error: {e}")

def find_absent_members(event):
    if event.target_type == "all_members":
        members_query = Members.query
    elif event.target_type == "group":
        group = Groups.query.get(event.Id_group)
        if not group:
            return []
        members_query = group.members
    else:
        return []
        
    present_ids = {p[0] for p in db.session.query(Presence.Id_member)
                          .filter_by(Id_event=event.id).all()}
    absent_ids = {a[0] for a in db.session.query(Absence.Id_member)
                         .filter_by(Id_event=event.id).all()}
                         
    absent_members = members_query.filter(
        ~Members.id.in_(present_ids),
        ~Members.id.in_(absent_ids)
    ).all()
    
    return [{
        "Id_event": event.id,
        "Id_member": m.id,
        "created_at": datetime.now()
    } for m in absent_members]

@recognition_bp.route('/video_stream')
def video_stream():

    return Response(
        recognition_manager.generate_stream(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )