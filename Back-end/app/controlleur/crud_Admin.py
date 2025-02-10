from flask import request
from flask_restx import Resource, fields, Namespace
from app.modele.model_Admin import Admin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.configuration.exts import db
from base64 import b64encode

Admin_ns = Namespace("Admin", description="Un espace pour l'Admin")

Admin_model = Admin_ns.model(
    "Admin",
    {
        "id": fields.Integer(required=True),
        "Username": fields.String(required=True),
        "Password": fields.Raw(required=True),
        "Image": fields.String(required=True),
        "Permission": fields.String(required=True),
    }
)

Login_model = Admin_ns.model(
    "Login",
    {
        "Username": fields.String(required=True),
        "Password": fields.Raw(required=True),
    }
)


@Admin_ns.route("/signUp")
class SignUp(Resource):
    @Admin_ns.marshal_list_with(Admin_model)
    def get(self):
        
        admins = Admin.query.all()
        for admin in admins:
            if admin.Image:
                admin.Image = b64encode(admin.Image).decode("utf-8") 
        return admins

    @Admin_ns.expect(Admin_model)
    @Admin_ns.marshal_with(Admin_model)
    def post(self):
        
        data = request.form or request.get_json()
        Username = data.get("Username")
        Permission = data.get("Permission")

        image_data = None
        image = request.files.get("Image")
        if image:
            image_data = image.read()
            print(f"Image reçue : {len(image_data)} octets")

        if Admin.query.filter_by(Username=Username).first():
            return {"message": f"L'Username '{Username}' existe déjà"}, 400

        new_admin = Admin(
            Username=Username,
            Password=generate_password_hash(data.get("Password")),
            Image=image_data,
            Permission=Permission ,
        )
        db.session.add(new_admin)
        db.session.commit()
        return new_admin, 201


@Admin_ns.route("/signUp/<int:id>")
class SignUpById(Resource):
    @Admin_ns.marshal_with(Admin_model)
    def get(self, id):
        
        admin = Admin.query.get_or_404(id)
        if admin.Image:
            admin.Image = b64encode(admin.Image).decode("utf-8")
        return admin

    @Admin_ns.marshal_with(Admin_model)
    def delete(self, id):
      
        admin = Admin.query.get_or_404(id)
        db.session.delete(admin)
        db.session.commit()
        return admin, 200

    @Admin_ns.expect(Admin_model)
    @Admin_ns.marshal_with(Admin_model)
    def put(self, id):
        
        admin = Admin.query.get_or_404(id)
        data = request.form or request.get_json()

        Username = data.get("Username", admin.Username)
        Permission = data.get("Permission", admin.Permission)

        if Admin.query.filter_by(Username=Username).first() and Username != admin.Username:
            return {"message": f"L'Username '{Username}' existe déjà"}, 400

        admin.Username = Username
        admin.Permission = Permission

        image = request.files.get("Image")
        if image:
            admin.Image = image.read()
            print(f"Nouvelle image reçue : {len(admin.Image)} octets")

        if "Password" in data:
            admin.Password = generate_password_hash(data["Password"])

        try:
            db.session.commit()
            return admin, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Une erreur est survenue : {str(e)}"}, 500

@Admin_ns.route("/Login")
class Login(Resource):
    @jwt_required()
    def get(self):
        
        current_user = get_jwt_identity()
        admin = Admin.query.filter_by(Username=current_user).first()

        if admin:
            return {
                "msg": "Admin connecté",
                "Username": admin.Username,
                "Permission": admin.Permission,
            }, 200
        return {"msg": "Administrateur non trouvé"}, 404

    @Admin_ns.expect(Login_model)
    def post(self):
        
        data = request.form or request.get_json()
        Username = data.get("Username")
        Password = data.get("Password")

        admin = Admin.query.filter_by(Username=Username).first()

        if admin and check_password_hash(admin.Password, Password):
            access_token = create_access_token(identity=admin.Username)
            refresh_token = create_refresh_token(identity=admin.Username)
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "Permission": admin.Permission,
                "Image": b64encode(admin.Image).decode("utf-8"),
                "Id": admin.id
            }, 200

        return {"msg": "Nom d'utilisateur ou mot de passe incorrect"}, 401


@Admin_ns.route("/refresh")
class Refresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return {"access_token": new_access_token}, 200
