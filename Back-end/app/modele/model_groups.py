from app.configuration.exts import db
from app.modele.member_groups import members_groups

class Groups(db.Model):
    __tablename__ = 'groups'
    
    id = db.Column(db.Integer, primary_key=True)
    Id_admin = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    Name_group = db.Column(db.String(30), nullable=False, unique=True)  # Ajout de `unique=True` pour éviter les doublons
    Fonction = db.Column(db.String(30), nullable=False)

    # Relation many-to-many avec les membres
    members = db.relationship(
        'Members', 
        secondary=members_groups, 
        back_populates='groups'
    )
    
    # Relation many-to-many avec les événements via la table de liaison
    events = db.relationship(
        'Event', 
        secondary='event_group',  # Assurez-vous que cette table existe
        back_populates='groups'
    )

    def __repr__(self):
        return f"<Group {self.Name_group}>"

    # Méthode pour sauvegarder l'instance dans la base de données
    def save(self):
        db.session.add(self)
        db.session.commit()

    # Méthode pour supprimer l'instance de la base de données
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    # Méthode pour mettre à jour les champs de l'instance
    def update(self, Name_group, Fonction):
        self.Name_group = Name_group
        self.Fonction = Fonction
        db.session.commit()

    # Méthode pour retirer un membre du groupe
    def remove_member(self, member):
        if member in self.members:
            self.members.remove(member)
            db.session.commit()
        else:
            raise ValueError(f"Le membre {member} n'est pas dans ce groupe.")

    # Méthode pour obtenir tous les membres du groupe
    def get_members(self):
        return self.members
