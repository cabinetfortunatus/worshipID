from flask import request
from flask_restx import Namespace, Resource, fields
from app.modele.model_absence import Absence  
from app.modele.model_members import Members
import base64
from app.configuration.exts import db
from app.controlleur.crud_members import members_ns

absence_ns = Namespace('absence', description="Un Espace pour les absences des membres")

member_model = members_ns.models['Member']
absence_model = absence_ns.model(
    "Absence",
    {
        "id": fields.Integer(),
        "Id_event": fields.Integer(required=True),
        "Id_member": fields.Integer(required=True),
        "Motif": fields.String(required=True),
        "member_info": fields.Nested(member_model),
    },
)

@absence_ns.route("/")
class AbsenceList(Resource):
    @absence_ns.marshal_with(absence_model, envelope='absences')
    def get(self):
        all_absences = Absence.query.all()
        absence_list = [
            {
                "id": absence.id,
                "Id_event": absence.Id_event,
                "Id_member": absence.Id_member,
                "Motif": absence.Motif,
                "member_info": {
                    "id": absence.member.id,
                    "Name": absence.member.Name,
                    "First_name": absence.member.First_name,
                    "Adress": absence.member.Adress,
                    "Gender": absence.member.Gender,
                    "Phone": str(absence.member.Phone),
                    "Image": base64.b64encode(absence.member.Image).decode('utf-8') if absence.member.Image else None
                }
            }
            for absence in all_absences
        ]
        return absence_list

    @absence_ns.marshal_with(absence_model, code=201)
    @absence_ns.expect(absence_model, validate=True)
    def post(self):
        data = request.get_json()  
        new_absence = Absence(
            Id_event=data.get('Id_event'),
            Id_member=data.get('Id_member'),
            Motif=data.get('Motif')
        )
        db.session.add(new_absence)
        db.session.commit()
        member = Members.query.get(new_absence.Id_member)
        new_absence_info = {
            "id": new_absence.id,
            "Id_event": new_absence.Id_event,
            "Id_member": new_absence.Id_member,
            "Motif": new_absence.Motif,
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
        return new_absence_info, 201 

@absence_ns.route('/<int:id>')
class AbsenceResource(Resource):
    @absence_ns.marshal_with(absence_model)
    def get(self, id):
        absence = Absence.query.get_or_404(id)
        member = Members.query.get(absence.Id_member)
        absence_info = {
            "id": absence.id,
            "Id_event": absence.Id_event,
            "Id_member": absence.Id_member,
            "Motif": absence.Motif,
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
        return absence_info

    @absence_ns.marshal_with(absence_model)
    @absence_ns.expect(absence_model)
    def put(self, id):
        absence_update = Absence.query.get_or_404(id)
        data = request.get_json()
        absence_update.Motif = data.get('Motif', absence_update.Motif)
        db.session.commit()
        member = Members.query.get(absence_update.Id_member)
        absence_update_info = {
            "id": absence_update.id,
            "Id_event": absence_update.Id_event,
            "Id_member": absence_update.Id_member,
            "Motif": absence_update.Motif,
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
        return absence_update_info

    @absence_ns.marshal_with(absence_model)
    def delete(self, id):
        absence_delete = Absence.query.get_or_404(id)
        db.session.delete(absence_delete)
        db.session.commit()
        return absence_delete
