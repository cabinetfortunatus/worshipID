from flask import request
from flask_restx import Namespace, Resource, fields
from app.modele.model_presence import Presence  
from app.configuration.exts import db

presence_ns = Namespace('presence', description="Espace pour gérer les présences")

presence_model = presence_ns.model(
    "Presence",
    {
        "id": fields.Integer(),
        "Id_event": fields.Integer(required=True),
        "Id_member": fields.Integer(required=True),
    },
)

@presence_ns.route("/")
class PresenceList(Resource):
    @presence_ns.marshal_with(presence_model)
    def get(self):
      
        all_presences = Presence.query.all()
        return all_presences

    @presence_ns.marshal_with(presence_model)
    @presence_ns.expect(presence_model)
    def post(self):
       
        data = request.get_json() 
        
        new_presence = Presence(
            Id_event=data.get('Id_event'),
            Id_member=data.get('Id_member'),
        )
        db.session.add(new_presence)
        db.session.commit()
        return new_presence, 201  

@presence_ns.route('/<int:id>')
class PresenceResource(Resource):
    @presence_ns.marshal_with(presence_model)
    def get(self, id):
      
        presence = Presence.query.get_or_404(id)
        return presence

    # @presence_ns.marshal_with(presence_model)
    # @presence_ns.expect(presence_model)
    # def put(self, id):
    #     """Mettre à jour une présence"""
    #     presence_update = Presence.query.get_or_404(id)
    #     data = request.get_json()
        
    #     presence_update.Id_event = data.get('Id_event', presence_update.Id_event)
    #     presence_update.Id_member = data.get('Id_member', presence_update.Id_member)
        
    #     db.session.commit()
    #     return presence_update

    # @presence_ns.marshal_with(presence_model)
    # def delete(self, id):
    #     """Supprimer une présence"""
    #     presence_delete = Presence.query.get_or_404(id)
    #     db.session.delete(presence_delete)
    #     db.session.commit()
    #     return presence_delete
