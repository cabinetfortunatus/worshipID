from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.modele.model_members import Members
from app.modele.model_groups import Groups  
from app.configuration.exts import db
from base64 import b64encode

members_ns = Namespace('members', description="Espace pour gérer les membres")

member_model = members_ns.model(
    "Member",
    {
        "id": fields.Integer(),
        "Id_users": fields.Integer(required=True),
        "Name": fields.String(required=True),
        "First_name": fields.String(required=True),
        "Adress": fields.String(required=True),
        "Gender": fields.String(required=True),
        "Phone": fields.String(required=True), 
        "Image": fields.String(required=True), 
    },
)

add_member_to_group_model = members_ns.model(
    "AddMemberToGroup",
    {
        "group_id": fields.Integer(required=True, description="ID du groupe auquel ajouter le membre")
    }
)

@members_ns.route("/")
class MemberList(Resource):
    @members_ns.marshal_with(member_model)
    def get(self):
        """Récupérer tous les membres"""
        all_members = Members.query.all()
        for member in all_members:
            if member.Image:
                # Encoder l'image en base64 pour une représentation dans la réponse
                member.Image = b64encode(member.Image).decode('utf-8')
        return all_members

    @members_ns.marshal_with(member_model)
    @members_ns.expect(member_model)
    def post(self):
        """Créer un membre et l'ajouter à un groupe si un group_id est fourni"""
        data = request.form or request.get_json()

        if not data.get('Name') or not data.get('First_name') or not data.get('Adress') or not data.get('Gender') or not data.get('Phone'):
            return {"message": "Tous les champs obligatoires doivent être remplis"}, 400

        # Vérification de l'image
        image_data = None
        image = request.files.get('Image')
        if image:
            image_data = image.read()
            print(f"Image reçue : {len(image_data)} octets")
        else:
            print("Aucune image reçue")

        # Créer un nouveau membre
        new_member = Members(
            Id_users=data.get('Id_users'),
            Name=data.get('Name'),
            First_name=data.get('First_name'),
            Adress=data.get('Adress'),
            Gender=data.get('Gender'),
            Phone=data.get('Phone'),
            Image=image_data  
        )
        
        # Ajouter à un groupe si group_id est fourni
        group_id = data.get('group_id')
        if group_id:
            group = Groups.query.get_or_404(group_id)
            try:
                # Ajouter le membre au groupe
                new_member.add_to_group(group)
            except ValueError as e:
                return {"message": str(e)}, 400
        
        db.session.add(new_member)
        db.session.commit()
        return new_member, 201  


@members_ns.route('/<int:id>')
class MemberResource(Resource):
    @members_ns.marshal_with(member_model)
    def get(self, id):
        """Récupérer un membre par son ID"""
        member = Members.query.get_or_404(id)
        if member.Image:
            # Encoder l'image en base64 pour une représentation dans la réponse
            member.Image = b64encode(member.Image).decode('utf-8')
        return member

    @members_ns.marshal_with(member_model)
    @members_ns.expect(member_model)
    def put(self, id):
        """Mettre à jour un membre et éventuellement l'ajouter à un groupe"""
        member_update = Members.query.get_or_404(id)
        data = request.form or request.get_json()

        if not data.get('Name') or not data.get('First_name') or not data.get('Adress') or not data.get('Gender') or not data.get('Phone'):
            return {"message": "Tous les champs obligatoires doivent être remplis"}, 400

        # Mise à jour des informations du membre
        member_update.Id_users = data.get('Id_users', member_update.Id_users)
        member_update.Name = data.get('Name', member_update.Name)
        member_update.First_name = data.get('First_name', member_update.First_name)
        member_update.Adress = data.get('Adress', member_update.Adress)
        member_update.Gender = data.get('Gender', member_update.Gender)
        member_update.Phone = data.get('Phone', member_update.Phone)

        # Mise à jour de l'image si elle est envoyée
        image = request.files.get('Image')
        if image:
            image_data = image.read()
            member_update.Image = image_data
            print(f"Nouvelle image reçue : {len(image_data)} octets")

        # Traitement du group_id (ajout ou suppression du groupe)
        group_id = data.get('group_id')
        if group_id:
            group = Groups.query.get_or_404(group_id)
            try:
                # Ajouter le membre au groupe si nécessaire
                member_update.add_to_group(group)
            except ValueError as e:
                return {"message": str(e)}, 400
        else:
            # Si aucun group_id n'est donné, on vérifie si le membre fait partie d'un groupe et on le retire si nécessaire
            member_update.remove_from_all_groups()

        # Sauvegarder les changements dans la base de données
        db.session.commit()
        return member_update


    @members_ns.marshal_with(member_model)
    def delete(self, id):
        """Supprimer un membre"""
        member_delete = Members.query.get_or_404(id)
        db.session.delete(member_delete)
        db.session.commit()
        return member_delete
