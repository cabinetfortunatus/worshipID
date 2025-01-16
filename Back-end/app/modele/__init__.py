from flask import Flask
from app.configuration.exts import init_db

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config")
    
    init_db(app)
    
    return app

