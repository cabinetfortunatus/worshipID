from flask import request
from flask_restx import Namespace, Resource, fields
from app.modele.model_absence import Absence  
from app.configuration.exts import db

absence_ns = Namespace('absence', description="Un Espace pour les absences des membres")

absence_model = absence_ns.model(
    "Absence",
    {
        "id": fields.Integer(),
        "Id_event": fields.Integer(required=True),
        "Id_member": fields.Integer(required=True),
        "Motif": fields.String(required=True),
    },
)

@absence_ns.route("/")
class AbsenceList(Resource):
    @absence_ns.marshal_with(absence_model)
    def get(self):
   
        all_absences = Absence.query.all()
        return all_absences
    
    @absence_ns.marshal_with(absence_model)
    @absence_ns.expect(absence_model)
    def post(self):
   
        data = request.get_json()  
        
        new_absence = Absence(
            Id_event=data.get('Id_event'),
            Id_member=data.get('Id_member'),
            Motif=data.get('Motif')
        )
        db.session.add(new_absence)
        db.session.commit()
        return new_absence, 201 

@absence_ns.route('/<int:id>')
class AbsenceResource(Resource):
    @absence_ns.marshal_with(absence_model)
    def get(self, id):
      
        absence = Absence.query.get_or_404(id)
        return absence

    @absence_ns.marshal_with(absence_model)
    @absence_ns.expect(absence_model)
    def put(self, id):
      
        absence_update = Absence.query.get_or_404(id)
        data = request.get_json()

        absence_update.Motif = data.get('Motif', absence_update.Motif)
        
        db.session.commit()
        return absence_update

    @absence_ns.marshal_with(absence_model)
    def delete(self, id):
    
        absence_delete = Absence.query.get_or_404(id)
        db.session.delete(absence_delete)
        db.session.commit()
        return absence_delete
