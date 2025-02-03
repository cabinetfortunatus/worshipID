from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.configuration.exts import db
from app.modele.model_users import Users
from base64 import b64encode, b64decode

users_ns = Namespace('users', description="Gestion des utilisateurs")

user_model = users_ns.model(
    "User",
    {
        "id": fields.Integer(readOnly=True),
        "id_admin": fields.Integer(readOnly=True, description="ID de l'admin associé (facultatif)"),
        "Username": fields.String(required=True, description="Nom d'utilisateur"),
        "Image": fields.String(description="Image encodée en base64"),
        "Password": fields.String(required=True, description="Mot de passe"),
    },
)

Login_model = users_ns.model(
    "Login",
    {
        "Username": fields.String(required=True, description="Nom d'utilisateur"),
        "Password": fields.String(required=True, description="Mot de passe"),
    }
)

@users_ns.route("/")
class UsersList(Resource):
    @users_ns.marshal_with(user_model)
    @jwt_required()  
    def get(self):
        all_users = Users.query.all()  
        for user in all_users:
            if user.Image:
                user.Image = b64encode(user.Image).decode('utf-8')  
        return all_users
    
    @users_ns.expect(user_model)
    @users_ns.marshal_with(user_model)
    def post(self):
        data = request.form or request.get_json()
        Username = data.get('Username')

        image_data = None
        image = request.files.get("Image")
        if image:
            image_data = image.read()
            
            print(f"Image reçue : {len(image_data)} octets")
            
        if Users.query.filter_by(Username=Username).first():  
            return {"message": f"Nom d'utilisateur '{Username}' est déjà pris."}, 409
        
        
        new_user = Users(
            id_admin=data.get('id_admin'),
            Username=Username,
            Image=image_data,
            Password=generate_password_hash(data.get('Password'))
        )
        
        db.session.add(new_user)
        db.session.commit()
        return new_user, 201

@users_ns.route('/<int:id>')
class UserResource(Resource):
    @users_ns.marshal_with(user_model)
    def get(self, id):
        user = Users.query.get_or_404(id)
        if user.Image:
            user.Image = b64encode(user.Image).decode('utf-8')  
        return user

    @users_ns.marshal_with(user_model)
    @users_ns.expect(user_model)
    def put(self, id):
        user_to_update = Users.query.get_or_404(id)
        data = request.form or request.get_json()

        user_to_update.Username = data.get('Username', user_to_update.Username)

        if new_password := data.get('Password'):
            user_to_update.Password = generate_password_hash(new_password)

        if image := request.files.get('Image'):
            user_to_update.Image = image.read()

        try:
            db.session.commit()
            return user_to_update, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Une erreur est survenue : {str(e)}"}, 500

    @jwt_required()  
    def delete(self, id):
          
        user_to_delete = Users.query.get_or_404(id)
        db.session.delete(user_to_delete)
        db.session.commit()
        return {"message": "Utilisateur supprimé avec succès"}, 200


@users_ns.route('/update')
class UpdateCredentials(Resource):
    @jwt_required()
    def put(self):
        current_user_id = get_jwt_identity()
        user = Users.query.get_or_404(current_user_id)

        data = request.form or request.get_json()

        old_password = data.get('old_password')
        if old_password and not check_password_hash(user.Password, old_password):
            return {"message": "L'ancien mot de passe est incorrect."}, 401

        if new_username := data.get('Username'):
            user.Username = new_username
        if new_password := data.get('Password'):
            user.Password = generate_password_hash(new_password)

        if image := data.get('Image'):
            user.Image = b64decode(image)

        db.session.commit()
        return {"message": "Informations mises à jour avec succès."}, 200

@users_ns.route('/Login')
class UserLogin(Resource):
    @users_ns.expect(Login_model)  
    def post(self):
       
        data = request.form or request.get_json()
        Username = data.get('Username')
        Password = data.get('Password')

        
        user = Users.query.filter_by(Username=Username).first()

        if user and check_password_hash(user.Password, Password):
           
            access_token = create_access_token(identity=user.Username)
            refresh_token = create_refresh_token(identity=user.Username)
            
          
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "Permission": user.Permission,  
            }, 200

      
        return {"message": "Nom d'utilisateur ou mot de passe incorrect."}, 401

