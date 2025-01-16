from app import create_app
from app.configuration.exts import db
from app.modele.model_Admin import Admin
from app.modele.model_absence import Absence
from app.modele.model_events import Event
from app.modele.model_groups import Groups
from app.modele.model_members import Members
from app.modele.model_presence import Presence
from app.modele.model_users import Users

from flask_jwt_extended import JWTManager

app = create_app()


jwt = JWTManager(app)

@app.shell_context_processor
def make_shell_context():
    return {
        "db":db,
        "Admin": Admin,
        "Absence": Absence,
        "Event": Event,
        "Groups": Groups,
        "Members": Members,
        "Presence": Presence,
        "Users": Users
    }
    
if __name__ =="__main__":
    app.run()