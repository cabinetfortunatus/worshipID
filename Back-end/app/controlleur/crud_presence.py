from flask import request
from flask_restx import Namespace, Resource, fields
from app.modele.model_presence import Presence  
from app.modele.model_members import Members
import base64
from app.controlleur.crud_members import members_ns
from app.configuration.exts import db


presence_ns = Namespace('presence', description="Espace pour gérer les présences")

member_model = members_ns.models['Member']

presence_model = presence_ns.model(
    "Presence",
    {
        "id": fields.Integer(),
        "Id_event": fields.Integer(required=True),
        "Id_member": fields.Integer(required=True),
        "member_info": fields.Nested(member_model),
    },
)

@presence_ns.route("/")
class PresenceList(Resource):
    @presence_ns.marshal_with(presence_model, envelope='presences')
    def get(self):
        all_presences = Presence.query.all()
        presence_list = [
            {
                "id": presence.id,
                "Id_event": presence.Id_event,
                "Id_member": presence.Id_member,
                "member_info": {
                    "id": presence.member.id,
                    "Name": presence.member.Name,
                    "First_name": presence.member.First_name,
                    "Adress": presence.member.Adress,
                    "Gender": presence.member.Gender,
                    "Phone": str(presence.member.Phone),
                    "Image": base64.b64encode(presence.member.Image).decode('utf-8') if presence.member.Image else None
                }
            }
            for presence in all_presences
        ]
        return presence_list

    @presence_ns.marshal_with(presence_model, code=201)
    @presence_ns.expect(presence_model, validate=True)
    def post(self):
        data = request.get_json() 
        new_presence = Presence(
            Id_event=data.get('Id_event'),
            Id_member=data.get('Id_member'),
        )
        db.session.add(new_presence)
        db.session.commit()
        member = Members.query.get(new_presence.Id_member)
        new_presence_info = {
            "id": new_presence.id,
            "Id_event": new_presence.Id_event,
            "Id_member": new_presence.Id_member,
            "member_info": {
                "id": member.id,
                "Name": member.Name,
                "First_name": member.First_name,
                "Adress": member.Adress,
                "Gender": member.Gender,
                "Phone": str(member.Phone),
                "Image": base64.b64encode(member.Image).decode('utf-8') if member.Image else None
            }
        }
        return new_presence_info, 201  

@presence_ns.route('/<int:id>')
class PresenceResource(Resource):
    @presence_ns.marshal_with(presence_model)
    def get(self, id):
        presence = Presence.query.get_or_404(id)
        member = Members.query.get(presence.Id_member)
        presence_info = {
            "id": presence.id,
            "Id_event": presence.Id_event,
            "Id_member": presence.Id_member,
            "member_info": {
                "id": member.id,
                "Name": member.Name,
                "First_name": member.First_name,
                "Adress": member.Adress,
                "Gender": member.Gender,
                "Phone": str(member.Phone),
                "Image": base64.b64encode(member.Image).decode('utf-8') if member.Image else None
            }
        }
        return presence_info
