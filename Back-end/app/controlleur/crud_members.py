from flask import request
from flask_restx import Namespace, Resource, fields
from app.modele.model_members import Members
from app.modele.model_groups import Groups
from app.configuration.exts import db
from base64 import b64encode
from PIL import Image
from io import BytesIO


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


def resize_image(image_data, original_format, target_size=(800, 800)):
    
    try:
        
        if original_format.upper() == "JPG":
            original_format = "JPEG"

        with Image.open(BytesIO(image_data)) as img:
            img.thumbnail(target_size, Image.Resampling.LANCZOS)
            img_io = BytesIO()
            img.save(img_io, format=original_format)  
            img_io.seek(0)
            return img_io.read()
    except Exception as e:
        print(f"Erreur lors du redimensionnement de l'image : {e}")
        return None


@members_ns.route("/")
class MemberList(Resource):
    @members_ns.marshal_with(member_model)
    def get(self):
       
        all_members = Members.query.all()
        for member in all_members:
            if member.Image:
                member.Image = b64encode(member.Image).decode('utf-8')
        return all_members

    @members_ns.marshal_with(member_model)
    @members_ns.expect(member_model)
    def post(self):
  
        data = request.form or request.get_json()

        if not data.get('Name') or not data.get('First_name') or not data.get('Adress') or not data.get('Gender') or not data.get('Phone'):
            return {"message": "Tous les champs obligatoires doivent être remplis"}, 400

   
        image_data = None
        image = request.files.get('Image')
        if image:
            image_data = image.read()
            original_format = image.filename.split('.')[-1].upper()
          
            if original_format not in ["JPEG", "JPG", "PNG"]:
                return {"message": "Format d'image non supporté. Utilisez JPEG, JPG ou PNG."}, 400
            
            image_data = resize_image(image_data, original_format)
        else:
            print("Aucune image reçue")

        new_member = Members(
            Id_users=data.get('Id_users'),
            Name=data.get('Name'),
            First_name=data.get('First_name'),
            Adress=data.get('Adress'),
            Gender=data.get('Gender'),
            Phone=data.get('Phone'),
            Image=image_data
        )

     
        group_id = data.get('group_id')
        if group_id:
            group = Groups.query.get_or_404(group_id)
            try:
              
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
       
        member = Members.query.get_or_404(id)
        if member.Image:
            member.Image = b64encode(member.Image).decode('utf-8')
        return member

    @members_ns.marshal_with(member_model)
    @members_ns.expect(member_model)
    def put(self, id):
        
        member_update = Members.query.get_or_404(id)
        data = request.form or request.get_json()

        if not data.get('Name') or not data.get('First_name') or not data.get('Adress') or not data.get('Gender') or not data.get('Phone'):
            return {"message": "Tous les champs obligatoires doivent être remplis"}, 400

        member_update.Id_users = data.get('Id_users', member_update.Id_users)
        member_update.Name = data.get('Name', member_update.Name)
        member_update.First_name = data.get('First_name', member_update.First_name)
        member_update.Adress = data.get('Adress', member_update.Adress)
        member_update.Gender = data.get('Gender', member_update.Gender)
        member_update.Phone = data.get('Phone', member_update.Phone)

        image = request.files.get('Image')
        if image:
            image_data = image.read()
            original_format = image.filename.split('.')[-1].upper()
            if original_format not in ["JPEG", "JPG", "PNG"]:
                return {"message": "Format d'image non supporté. Utilisez JPEG, JPG ou PNG."}, 400
       
            image_data = resize_image(image_data, original_format)
            member_update.Image = image_data
            print(f"Nouvelle image reçue et redimensionnée : {len(image_data)} octets")

      
        group_id = data.get('group_id')
        if group_id:
            group = Groups.query.get_or_404(group_id)
            try:
                
                member_update.add_to_group(group)
            except ValueError as e:
                return {"message": str(e)}, 400
        else:
          
            member_update.remove_from_all_groups()

        db.session.commit()
        return member_update
    
@members_ns.route('/<int:id>/groups')   
class MemberGroupsResource(Resource):
    def get(self, id):
        member = Members.query.get_or_404(id)
        groups = member.groups 
        if not groups:
            return {"message": "Ce membre n'est dans aucun groupe."}, 404

        group_names = [group.Name_group for group in groups]
        return {"groups": group_names}, 200


    @members_ns.marshal_with(member_model)
    def delete(self, id):
    
        member_delete = Members.query.get_or_404(id)
        db.session.delete(member_delete)
        db.session.commit()
        return member_delete
