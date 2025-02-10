from flask import request, jsonify, make_response
from flask_restx import Namespace, Resource, fields
from app.modele.model_groups import Groups  
from app.modele.model_members import Members 
from app.configuration.exts import db 
import base64 

groups_ns = Namespace('groups', description="Gestion des groupes")

group_model = groups_ns.model(
    "Group",
    {
        "id": fields.Integer(readOnly=True, description="ID du groupe"),
        "Id_admin": fields.Integer(required=True, description="ID de l'admin associé"),
        "Name_group": fields.String(required=True, description="Nom du groupe"),
        "Fonction": fields.String(required=True, description="Fonction du groupe"),
    },
)

@groups_ns.route("/")
class GroupsList(Resource):
    @groups_ns.marshal_with(group_model)
    def get(self):
        all_groups = Groups.query.all()  
        return all_groups
        
    @groups_ns.marshal_with(group_model)
    @groups_ns.expect(group_model)
    def post(self):
        data = request.form or request.get_json()
        
        new_group = Groups(
            Id_admin=data.get('Id_admin'),
            Name_group=data.get('Name_group'),
            Fonction=data.get('Fonction'),
        )

        db.session.add(new_group)
        db.session.commit()
        return new_group, 201

@groups_ns.route('/<int:id>')
class GroupResource(Resource):
    @groups_ns.marshal_with(group_model)
    def get(self, id):
        group = Groups.query.get_or_404(id)
        return group

    @groups_ns.marshal_with(group_model)
    @groups_ns.expect(group_model)
    def put(self, id):
        
        group_to_update = Groups.query.get_or_404(id)
        data = request.form or request.get_json()

        group_to_update.update(
            Name_group=data.get('Name_group', group_to_update.Name_group),
            Fonction=data.get('Fonction', group_to_update.Fonction)
        )
        return group_to_update, 200

    def delete(self, id):

        group_to_delete = Groups.query.get_or_404(id)
        group_to_delete.delete()
        return {"message": "Groupe supprimé avec succès"}, 200

@groups_ns.route('/<int:group_id>/members')
class GroupMembers(Resource):
    def get(self, group_id):
        
        group = Groups.query.get_or_404(group_id)
        members = group.members

        result = [
            {
                "id": member.id,
                "Name": member.Name,
                "First_name": member.First_name,
                "Adress": member.Adress,
                "Gender": member.Gender,
                "Phone": str(member.Phone), 
                "Image": base64.b64encode(member.Image).decode('utf-8') if member.Image else None
            }
            for member in members
        ]

        return  result, 200
    

@groups_ns.route('/<int:group_id>/members/<int:member_id>')
class RemoveGroupMember(Resource):
    def delete(self, group_id, member_id):
        group = Groups.query.get_or_404(group_id)
        member = Members.query.get_or_404(member_id)

        if member not in group.members:
            return make_response(jsonify({"error": "Ce membre ne fait pas partie de ce groupe."}), 400)

        try:
            group.members.remove(member)
            db.session.commit()
            return make_response(jsonify({"message": "Membre supprimé du groupe avec succès"}), 200)
        except Exception as e:
    
            db.session.rollback()
            return make_response(jsonify({"error": f"Une erreur est survenue : {str(e)}"}), 500)
