from flask import Blueprint, request, jsonify
from app.configuration.exts import db
from app.modele.model_events import Event
from app.modele.model_presence import Presence
from app.modele.model_absence import Absence
from datetime import datetime
import cv2
import face_recognition
from ultralytics import YOLO
from PIL import Image
from io import BytesIO
import numpy as np
import time
import os

# Chargement du modèle YOLO pour la reconnaissance faciale
current_path = os.getcwd()
model_path = os.path.join(current_path, "app", "controlleur", "yolov8n-face.pt")
model = YOLO(model_path)

# Définir le Blueprint
recognition_bp = Blueprint('recognition', __name__)

# Fonction pour convertir un blob en image
def blob_to_image(blob):
    """Convertit un blob binaire en image NumPy."""
    try:
        image = Image.open(BytesIO(blob))
        return np.array(image)
    except Exception as e:
        print(f"Erreur lors de la conversion de l'image : {e}")
        return None

# Fonction pour identifier un membre par reconnaissance faciale
def identify_member(frame, known_encodings, known_members):
    """Identifie un membre dans une image à partir des encodages connus."""
    frame_locations = face_recognition.face_locations(frame)
    frame_encodings = face_recognition.face_encodings(frame, frame_locations)
    
    for encoding in frame_encodings:
        matches = face_recognition.compare_faces(known_encodings, encoding)
        if True in matches:
            index = matches.index(True)
            return known_members[index]
    return None

# Fonction pour enregistrer la présence d'un membre
def record_presence(Id_event, Id_member):
    """Enregistre la présence d'un membre pour un événement donné."""
    presence = Presence(Id_event=Id_event, Id_member=Id_member, timestamp=datetime.now())
    db.session.add(presence)
    db.session.commit()

# Fonction pour enregistrer les absences des membres
def record_absences(Id_event, members_present):
    """Enregistre les absences pour tous les membres non présents dans un événement."""
    event = Event.query.get(Id_event)
    if not event:
        return {"message": "Événement introuvable."}

    all_members = {member.id for group in event.groups for member in group.members}
    absent_members = all_members - members_present

    for member_id in absent_members:
        absence = Absence(Id_event=Id_event, Id_member=member_id, timestamp=datetime.now())
        db.session.add(absence)

    db.session.commit()
# Route pour démarrer un événement et effectuer la reconnaissance faciale
@recognition_bp.route('/start_event', methods=['POST'])
def start_event():
    """Démarre un événement existant avec reconnaissance faciale pour enregistrer les présences."""
    data = request.get_json()
    event_id = data.get('Id_event')

    if not event_id:
        return jsonify({"message": "ID d'événement manquant."}), 400

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"message": "Événement introuvable."}), 404

    members = [member for group in event.groups for member in group.members]
    if not members:
        return jsonify({"message": "Aucun membre trouvé pour cet événement."}), 404

    known_encodings = []
    known_members = []

    # Charger les images et les encodages des membres
    for member in members:
        if member.Image:
            known_image = blob_to_image(member.Image)
            if known_image is not None:
                encoding = face_recognition.face_encodings(known_image)
                if encoding:
                    known_encodings.append(encoding[0])
                    known_members.append(member)

    # Configurer la webcam
    Ip_webcam = "http://192.168.1.171:8080/video"
    cap = cv2.VideoCapture(Ip_webcam)

    if not cap.isOpened():
        return jsonify({"message": "Erreur : Impossible d'ouvrir le flux vidéo."}), 500

    members_present = set()

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.resize(frame, (640, 480))
            results = model(frame)

            for face in results[0].boxes:
                x1, y1, x2, y2 = map(int, face.xyxy[0])
                face_frame = frame[y1:y2, x1:x2]
                member = identify_member(face_frame, known_encodings, known_members)

                if member and member.id not in members_present:
                    members_present.add(member.id)
                    record_presence(event_id, member.id)

                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, member.Name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            cv2.imshow("Reconnaissance faciale", frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

            time.sleep(0.1)

    finally:
        cap.release()
        cv2.destroyAllWindows()

    # Marquer l'événement comme terminé sans le statut "en cours"
    record_absences(event_id, members_present)
    return jsonify({"message": "Événement terminé, absences enregistrées."}), 200
