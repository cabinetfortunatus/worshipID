from flask import Blueprint, jsonify, current_app
import numpy as np
import cv2
import face_recognition
from ultralytics import YOLO
import threading
import queue
import torch
import os
from app.modele.model_members import Members
from sqlalchemy.exc import SQLAlchemyError
import time



recognition_bp = Blueprint('recognition', __name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

current_path = os.getcwd()
model_path = os.path.join(current_path, "app", "controlleur", "yolov8n-face.pt")

try:
    model = YOLO(model_path)
    model.to(device)
    model.overrides['verbose'] = False
    print("[INFO] Modèle YOLO chargé avec succès.")
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
        # print(f"{len(members)} membres trouvés dans la base de données.")
    
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
                    # print(f"Encodage ajouté pour {member.Name} {member.First_name}")

                except Exception as e:
                    print(f"Erreur lors du traitement de l'image pour {member.Name}: {e}")
            else:
                print(f"Aucune image disponible pour {member.Name} {member.First_name}")


def process_frames():
    global processed_frame
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
                        else:
                            name = "Inconnu"
                            color = (0, 0, 255)

                        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                        cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            with processing_lock:
                processed_frame = frame

def start_video_processing():
    global cap
    with current_app.app_context():
        video_url = current_app.config.get("VIDEO_URL")
        print(video_url)
    cap.open(f"{video_url}/video")  
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

threading.Thread(target=process_frames, daemon=True).start()

@recognition_bp.route('/start_recognition', methods=['POST'])
def start_recognition():   
    load_members_from_db() 
    if not cap.isOpened():
        threading.Thread(target=start_video_processing, daemon=True).start()
        wait_for_frame()
        return jsonify({"message": "Reconnaissance faciale démarrée."}), 200
    return jsonify({"message": "Reconnaissance faciale déjà en cours."}), 400

@recognition_bp.route('/stop_recognition', methods=['POST'])
def stop_recognition():
    global cap
    if cap.isOpened():
        cap.release()       
        cv2.destroyAllWindows()      
        
        
        return jsonify({"message": "Reconnaissance faciale arrêtée et images temporaires supprimées."}), 200
    return jsonify({"message": "Aucun flux vidéo actif."}), 400

@recognition_bp.route('/check_loaded_data', methods=['GET'])
def check_loaded_data():
    return jsonify({
        "encodings_count": len(known_encodings),
        "names": known_names
    }), 200
