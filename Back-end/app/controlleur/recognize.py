from flask import Blueprint, jsonify, current_app
import numpy as np
import cv2
import face_recognition
from ultralytics import YOLO
import threading
import queue
import torch
import os
from app.configuration.exts import db  
from app.modele.model_members import Members
from sqlalchemy.exc import SQLAlchemyError
import time
from app.modele.model_events import Event
from app.modele.model_presence import Presence
from app.modele.model_absence import Absence
from app.modele.model_groups import Groups
import base64

recognition_bp = Blueprint('recognition', __name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

current_path = os.getcwd()
model_path = os.path.join(current_path, "app", "controlleur", "yolov8n-face.pt")

try:
    model = YOLO(model_path)
    model.to(device)
    model.overrides['verbose'] = False
    # print("[INFO] Modèle YOLO chargé avec succès.")
except Exception as e:
    print(f"[ERROR] Échec du chargement du modèle YOLO : {e}")

known_encodings = []
known_names = []

cap = cv2.VideoCapture()
frame_queue = queue.Queue(maxsize=2)
processed_frame = None
processing_lock = threading.Lock()

def load_members_from_db():
    with current_app.app_context():
        members = Members.query.all()
        print(f"{len(members)} membres trouvés dans la base de données.")
    
        for member in members:
            if member.Image:
                try:
                    nparr = np.frombuffer(member.Image, np.uint8)
                    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                    if image is None:
                        raise ValueError(f"L'image du membre {member.First_name} est corrompue ou non lisible.")
                  
                    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                    face_locations = face_recognition.face_locations(image_rgb)

                    if len(face_locations) == 0:
                        print(f"Aucun visage détecté pour {member.Name} {member.First_name}\n{member.Adress}")
                        continue

                    encoding = face_recognition.face_encodings(image_rgb)[0]
                    known_encodings.append(encoding)
                    known_names.append(f"{member.Name} {member.First_name}")
                    print(f"Encodage du visage de {member.Name} {member.First_name} ajouté avec succès.")
                    
                except Exception as e:
                    print(f"Erreur lors du traitement de l'image pour {member.Name}: {e}")
            else:
                print(f"Aucune image disponible pour {member.Name} {member.First_name}")

def process_frames(Id_event, app):
    global processed_frame
    with app.app_context():
        while True:
            if not frame_queue.empty():
                frame = frame_queue.get()
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = model(frame, imgsz=320)
                faces = results[0].boxes

                if len(faces) > 0:
                    for face in faces:
                        x1, y1, x2, y2 = map(int, face.xyxy[0])
                        face_roi = frame_rgb[y1:y2, x1:x2]
                        if face_roi.size == 0:
                            continue

                        face_encoding = face_recognition.face_encodings(frame_rgb, [(y1, x2, y2, x1)])
                        if face_encoding:
                            matches = face_recognition.compare_faces(known_encodings, face_encoding[0])
                            distances = face_recognition.face_distance(known_encodings, face_encoding[0])
                            best_match_index = distances.argmin() if len(distances) > 0 else None

                            if best_match_index is not None and matches[best_match_index]:
                                name = known_names[best_match_index]
                                color = (0, 255, 0)

                                try:
                                    event = Event.query.get(Id_event)
                                    if event.target_type == "all_members":
                                        member = Members.query.filter_by(Name=name.split()[0], First_name=name.split()[1]).first()
                                        if member:
                                           
                                            presence_exists = db.session.query(Presence).filter_by(Id_event=event.id, Id_member=member.id).first()
                                            if not presence_exists:
                                                presence = Presence(
                                                    Id_event=event.id,
                                                    Id_member=member.id
                                                )
                                                db.session.add(presence)
                                                db.session.commit()
                                                
                                    elif event.target_type == "group":
                                        group = Groups.query.get(event.Id_group)
                                        if group and member_is_in_group(name, group):
                                            member = Members.query.filter_by(Name=name.split()[0], First_name=name.split()[1]).first()
                                            if member:
                                                presence_exists = db.session.query(Presence).filter_by(Id_event=event.id, Id_member=member.id).first()
                                                if not presence_exists:
                                                    presence = Presence(
                                                        Id_event=event.id,
                                                        Id_member=member.id
                                                    )
                                                    db.session.add(presence)
                                                    db.session.commit()
                                                    
                                                
                                except SQLAlchemyError as e:
                                    print(f"Erreur lors de l'ajout à la base de données : {e}")
                                    db.session.rollback()

                            else:
                                name = "Inconnu"
                                color = (0, 0, 255)

                            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                            cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

                with processing_lock:
                    processed_frame = frame

def start_video_processing():
    global cap
    cap.open("http://192.168.1.171:8080/video")  
    if not cap.isOpened():
        print("Erreur : Impossible d'ouvrir le flux vidéo.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Erreur de lecture du flux vidéo.")
            break

        if not frame_queue.full():
            frame_queue.put(frame)

        with processing_lock:
            if processed_frame is not None:
                cv2.imshow("Reconnaissance faciale des membres", processed_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

def wait_for_frame():
    while frame_queue.empty():
        time.sleep(0.1)

@recognition_bp.route('/start_event/<int:id_event>', methods=['POST'])
def start_event(id_event):
    with current_app.app_context():
        event = Event.query.get(id_event)
        if not event:
            return jsonify({"message": "Événement non trouvé."}), 404
        load_members_from_db()
        app = current_app._get_current_object()
        threading.Thread(target=process_frames, args=(id_event, app), daemon=True).start()
        threading.Thread(target=start_video_processing, daemon=True).start()
        wait_for_frame()
        presences = Presence.query.filter_by(Id_event=id_event).all()
        import base64

        members_info = [
    {
        "id": p.member.id if p.member else None,
        "Name": p.member.Name if p.member else None,
        "First_name": p.member.First_name if p.member else None,
        "Adress": p.member.Adress if p.member else None,
        "Gender": p.member.Gender if p.member else None,
        "Phone": str(p.member.Phone) if p.member else None,
        "Image": base64.b64encode(p.member.Image).decode("utf-8") if p.member and p.member.Image else None,
    }
        for p in presences if p.member  # Exclure les entrées sans membre associé
    ]

        

        return jsonify({"message": f"Événement {event.Name_event} démarré, reconnaissance faciale activée.", "presences": members_info}), 200

@recognition_bp.route('/stop_event/<int:id_event>', methods=['POST'])
def stop_event(id_event):
    with current_app.app_context():
        event = Event.query.get(id_event)
        if not event:
            return jsonify({"message": "Événement non trouvé."}), 404

        absences_info = []
        for name in known_names:
            member = Members.query.filter_by(Name=name.split()[0], First_name=name.split()[1]).first()
            if member:
              
                present = any(p.Id_member == member.id for p in Presence.query.filter_by(Id_event=event.id).all())
      
                absent = db.session.query(Absence).filter_by(Id_event=event.id, Id_member=member.id).first()
                if not present and not absent:
                    absence = Absence(Id_event=event.id, Id_member=member.id)
                    db.session.add(absence)
                    absences_info.append({"Id_member": member.id, 
                                          "Name": member.Name, 
                                          "First_name": member.First_name,
                                          "Adress": member.Adress,
                                          "Gender": member.Gender,
                                          "Phone": str(member.Phone),
                                          "Image": base64.b64encode(member.Image).decode('utf-8') if member.Image else None})
        try:
            db.session.commit()
        except SQLAlchemyError as e:
            print(f"Erreur lors du commit des absences : {e}")
            db.session.rollback()

        cap.release()
        cv2.destroyAllWindows()
        return jsonify({"message": f"L'événement {event.Name_event} est terminé.", "absences": absences_info}), 200

@recognition_bp.route('/check_loaded_data', methods=['GET'])
def check_loaded_data():
    return jsonify({
        "encodings_count": len(known_encodings),
        "names": known_names
    }), 200

def member_is_in_group(name, group):
    group_members = [member.Name + ' ' + member.First_name for member in group.members]
    return name in group_members
