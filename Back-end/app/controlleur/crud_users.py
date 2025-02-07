from flask import request, jsonify, make_response
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from werkzeug.security import check_password_hash, generate_password_hash
from app.configuration.exts import db
from app.modele.model_users import Users


users_ns = Namespace('users', description="Gestion des utilisateurs")

user_model = users_ns.model(
    "User",
    {
        "id": fields.Integer(readOnly=True),
        "id_admin": fields.Integer(description="ID de l'admin associé (facultatif)"),
        "id_member": fields.Integer(description="ID de l'admin associé (facultatif)"),
        "Username": fields.String(required=True, description="Nom d'utilisateur"),
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


@users_ns.route("/signUp")
class UsersList(Resource):
    @users_ns.marshal_with(user_model)
    def get(self):
        try:
            all_users = Users.query.all()
            return all_users
        except Exception as e:
            return make_response(jsonify({"message": f"Une erreur est survenue : {str(e)}"}), 500)

    @users_ns.expect(user_model)
    @users_ns.marshal_with(user_model)
    def post(self):
        data = request.form or request.get_json()
        Username = data.get('Username')

        if Users.query.filter_by(Username=Username).first():
            return make_response(jsonify({"message": f"L'utilisateur {Username} existe déjà"}), 400)

        new_user = Users(
        id_admin=data.get('id_admin'),
        id_member=data.get('id_member'),
        Username=Username,
        Password=generate_password_hash(data.get('Password'))
    )

        try:
            db.session.add(new_user)
            db.session.commit()
            print(f"Utilisateur créé : {new_user.Username} - {new_user.id}")  # Debug
            return new_user, 201
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"message": f"Une erreur est survenue : {str(e)}"}), 500)

@users_ns.route('/signUp/<int:id>')
class SignUpById(Resource):
    @users_ns.marshal_with(user_model)
    def get(self, id):
        try:
            user = Users.query.get_or_404(id)
            return user
        except Exception as e:
            return make_response(jsonify({"message": f"Une erreur est survenue : {str(e)}"}), 500)

    @users_ns.marshal_with(user_model)
    @users_ns.expect(user_model)
    def put(self, id):
        try:
            user_to_update = Users.query.get_or_404(id)
            data = request.form or request.get_json()
            user_to_update.Username = data.get('Username', user_to_update.Username)

            if 'Password' in data:
                user_to_update.Password = generate_password_hash(data.get('Password'))

            db.session.commit()
            return user_to_update, 200

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"message": f"Une erreur est survenue : {str(e)}"}), 500)

    def delete(self, id):
        try:
            user_to_delete = Users.query.get_or_404(id)
            db.session.delete(user_to_delete)
            db.session.commit()
            return make_response(jsonify({"message": "Utilisateur supprimé avec succès"}), 200)
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"message": f"Une erreur est survenue : {str(e)}"}), 500)

@users_ns.route('/update')
class UpdateCredentials(Resource):
    @jwt_required()
    def put(self):
        try:
            current_user_id = get_jwt_identity()
            user = Users.query.get_or_404(current_user_id)
            data = request.form or request.get_json()

            old_password = data.get('old_password')
            if old_password and not check_password_hash(user.Password, old_password):
                return make_response(jsonify({"message": "L'ancien mot de passe est incorrect."}), 401)

            if 'Username' in data:
                user.Username = data['Username']
            if 'Password' in data:
                user.Password = generate_password_hash(data['Password'])
            
            db.session.commit()
            return make_response(jsonify({"message": "Informations mises à jour avec succès."}), 200)
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"message": f"Une erreur est survenue : {str(e)}"}), 500)

@users_ns.route('/Login')
class UserLogin(Resource):
    @users_ns.expect(Login_model)
    def post(self):
        data = request.get_json()
        Username = data.get('Username')
        Password = data.get('Password')

        print(f"Tentative de connexion : {Username}")  # Debug

        if not Username or not Password:
            return make_response(jsonify({"error": "Le nom d'utilisateur et le mot de passe sont obligatoires."}), 400)

        try:
            user = Users.query.filter_by(Username=Username).first()
            print(f"Utilisateur trouvé : {user}")  # Debug

            if user:
                print(f"Mot de passe stocké : {user.Password}")  # Debug
                if check_password_hash(user.Password, Password):
                    access_token = create_access_token(identity=user.id)
                    refresh_token = create_refresh_token(identity=user.id)
                    return make_response(jsonify({
                        "message": "Connexion réussie",
                        "access_token": access_token,
                        "refresh_token": refresh_token
                    }), 200)
                else:
                    print("Mot de passe incorrect")  # Debug
                    return make_response(jsonify({"error": "Mot de passe incorrect"}), 401)
            else:
                print("Nom d'utilisateur non trouvé")  # Debug
                return make_response(jsonify({"error": "Nom d'utilisateur non trouvé"}), 401)

        except Exception as e:
            return make_response(jsonify({"error": f"Une erreur est survenue : {str(e)}"}), 500)
