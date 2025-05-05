from flask import request
from flask_restx import Namespace, Resource, fields
from app.modele.model_events import Event
from app.modele.model_groups import Groups
from app.configuration.exts import db
from app.modele.model_members import Members
from app.modele.model_presence import Presence
from app.modele.model_absence import Absence
from app.controlleur.crud_members import members_ns
from app.controlleur.crud_presence import presence_ns
from app.controlleur.crud_absence import absence_ns
from base64 import b64encode

member_model = members_ns.models['Member']
presence_model = presence_ns.models['Presence']
absence_model = absence_ns.models['Absence']
event_ns = Namespace('event', description="Espace pour la gestion des événements")

event_model = event_ns.model(
    "Event",
    {
        "id": fields.Integer(),
        "Id_admin": fields.Integer(required=True),
        "Code_event": fields.String(required=True),
        "Name_event": fields.String(required=True),
        "Theme": fields.String(required=True),
        "Date": fields.String(required=True),
        "Duration": fields.String(required=True),
        "target_type": fields.String(required=True, enum=["group", "all_members"]),
        "Id_group": fields.Integer(),
    },
)

@event_ns.route("/")
class EventList(Resource):
    @event_ns.marshal_with(event_model)
    def get(self):
        all_events = Event.query.all()
        return all_events

    @event_ns.expect(event_model)
    @event_ns.marshal_with(event_model)
    def post(self):
        data = request.form or request.get_json()

        Id_admin = data.get("Id_admin")
        Code_event = data.get("Code_event")
        Name_event = data.get("Name_event")
        Theme = data.get("Theme")
        Date = data.get("Date")
        Duration = data.get("Duration")
        target_type = data.get("target_type")
        Id_group = data.get("Id_group", None)

        if not all([Id_admin, Code_event, Name_event, Theme, Date, Duration, target_type]):
            return {"message": "Tous les champs requis doivent être remplis."}, 400
    
        try:
            new_event = Event(
                Id_admin=Id_admin,
                Code_event=Code_event,
                Name_event=Name_event,
                Theme=Theme,
                Date=Date,
                Duration=Duration,
                target_type=target_type,
                Id_group=Id_group,
            )

            if target_type == "group" and Id_group:
                group = Groups.query.get(Id_group)
                if not group:
                    return {"message": "Le groupe spécifié n'existe pas."}, 404
                new_event.groups.append(group)

            if target_type == "all_members":
                new_event.add_all_members()

            db.session.add(new_event)
            db.session.commit()
            return new_event, 201
        
        except Exception as e:
            db.session.rollback()
            print(f"Erreur lors de l'ajout de l'événement : {e}")
            return {"message": "Une erreur est survenue lors de la création de l'événement."}, 500

@event_ns.route("/<int:id>")
class EventResource(Resource):
    @event_ns.marshal_with(event_model)
    def get(self, id):
        event = Event.query.get_or_404(id)
        return event

    @event_ns.expect(event_model)
    @event_ns.marshal_with(event_model)
    def put(self, id):
        event = Event.query.get_or_404(id)
        data = request.form or request.get_json()

        event.Id_admin = data.get("Id_admin", event.Id_admin)
        event.Code_event = data.get("Code_event", event.Code_event)
        event.Name_event = data.get("Name_event", event.Name_event)
        event.Theme = data.get("Theme", event.Theme)
        event.Date = data.get("Date", event.Date)
        event.Duration = data.get("Duration", event.Duration)
        target_type = data.get("target_type", event.target_type)
        Id_group = data.get("Id_group", None)

        if target_type == "group" and Id_group:
            group = Groups.query.get(Id_group)
            if not group:
                return {"message": "Le groupe spécifié n'existe pas."}, 404
            event.groups = [group]

        event.target_type = target_type
        event.Id_group = Id_group

        try:
            db.session.commit()
            return event
        except Exception as e:
            db.session.rollback()
            print(f"Erreur lors de la mise à jour de l'événement : {e}")
            return {"message": "Une erreur est survenue lors de la mise à jour de l'événement."}, 500

    def delete(self, id):
        event = Event.query.get_or_404(id)
        try:
            event.delete()
            db.session.commit()
            return {"message": "Événement supprimé avec succès."}, 204
        except Exception as e:
            db.session.rollback()
            print(f"Erreur lors de la suppression de l'événement : {e}")
            return {"message": "Une erreur est survenue lors de la suppression de l'événement."}, 500

@event_ns.route("/<int:id>/MembersPresent")
class EventMembersPresent(Resource):
    @event_ns.marshal_with(member_model)
    def get(self, id):
        event = Event.query.get_or_404(id)
        members = db.session.query(Members).join(Presence, Presence.Id_member == Members.id).filter(Presence.Id_event == id).all()
        for member in members:
            if member.Image:
                member.Image = b64encode(member.Image).decode('utf-8')
        return members
    
@event_ns.route("/<int:id>/MembersAbsent")
class EventMembersAbsent(Resource):
    @event_ns.marshal_with(member_model)
    def get(self, id):
        event = Event.query.get_or_404(id)
        members = db.session.query(Members).join(Absence, Absence.Id_member == Members.id).filter(Absence.Id_event == id).all()
        for member in members:
            if member.Image:
                member.Image = b64encode(member.Image).decode('utf-8')
        return members
        
@event_ns.route("/<int:id>/stats")
class EventStats(Resource):
    def get(self, id):
        event = Event.query.get_or_404(id)

        total_members = 0
        if event.target_type == "group" and event.Id_group:
            group = Groups.query.get(event.Id_group)
            total_members = len(group.members)
        elif event.target_type == "all_members":
            total_members = Members.query.count()

        nb_presents = Presence.query.filter_by(Id_event=id).count()
        nb_absents = Absence.query.filter_by(Id_event=id).count()

        try:
            taux_participation = (nb_presents / total_members) * 100 if total_members else 0
        except ZeroDivisionError:
            taux_participation = 0

        return {
            "id_event": id,
            "nom_evenement": event.Name_event,
            "nombre_total": total_members,
            "nombre_present": nb_presents,
            "nombre_absent": nb_absents,
            "taux_participation": round(taux_participation, 2)
        }, 200
