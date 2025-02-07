from flask import Flask
from flask_restx import Api
from app.configuration.config import DevConfig
from app.configuration.exts import db
from flask_cors import CORS
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevConfig)
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}},
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Authorization"],
        supports_credentials=True)
    api = Api(app, doc="/docs")
    
    

    from app.controlleur.recognize import recognition_bp
    from app.controlleur.crud_Admin import Admin_ns
    from app.controlleur.crud_absence import absence_ns
    from app.controlleur.crud_events import event_ns
    from app.controlleur.crud_groups import groups_ns
    from app.controlleur.crud_members import members_ns
    from app.controlleur.crud_presence import presence_ns
    from app.controlleur.crud_users import users_ns
    
    app.register_blueprint(recognition_bp, url_prefix='/recognition')
    api.add_namespace(Admin_ns)
    api.add_namespace(absence_ns)
    api.add_namespace(event_ns)
    api.add_namespace(groups_ns)
    api.add_namespace(members_ns)
    api.add_namespace(presence_ns)
    api.add_namespace(users_ns)
    return app 