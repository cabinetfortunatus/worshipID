from app.configuration.exts import db
from app.modele.member_groups import members_groups

class Groups(db.Model):
    __tablename__ = 'groups'
    
    id = db.Column(db.Integer, primary_key=True)
    Id_admin = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    Name_group = db.Column(db.String(30), nullable=False, unique=True)  
    Fonction = db.Column(db.String(30), nullable=False)

 
    members = db.relationship(
        'Members', 
        secondary=members_groups, 
        back_populates='groups'
    )
    

    events = db.relationship(
        'Event', 
        secondary='event_group', 
        back_populates='groups'
    )

    def __repr__(self):
        return f"<Group {self.Name_group}>"

 
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


    def update(self, Name_group, Fonction):
        self.Name_group = Name_group
        self.Fonction = Fonction
        db.session.commit()

    def remove_member(self, member):
        if member in self.members:
            self.members.remove(member)
            db.session.commit()
        else:
            raise ValueError(f"Le membre {member} n'est pas dans ce groupe.")

    def get_members(self):
        return self.members
