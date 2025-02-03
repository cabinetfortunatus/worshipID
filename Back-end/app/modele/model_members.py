from app.configuration.exts import db
from app.modele.member_groups import members_groups
from sqlalchemy.orm import relationship

class Members(db.Model):
    __tablename__ = 'members'
    
    id = db.Column(db.Integer(), primary_key=True)
    Id_users = db.Column(db.Integer(), db.ForeignKey('users.id'), unique=True)
    Name = db.Column(db.String(30), nullable=False)
    First_name = db.Column(db.String(30), nullable=False)
    Adress = db.Column(db.String(50), nullable=False)
    Gender = db.Column(db.String(10), nullable=False)
    Phone = db.Column(db.String(), nullable=False)
    Image = db.Column(db.LargeBinary(), nullable=False)
    
 
    groups = relationship('Groups', secondary=members_groups, back_populates='members', overlaps="members_list")
    group = relationship('Groups', secondary=members_groups, viewonly=True, overlaps="groups,members")
    user = db.relationship('Users', back_populates='members', lazy = True)
    events = db.relationship('Event', secondary='event_member', back_populates='members')
    absences = db.relationship('Absence', back_populates='member')
    presences = db.relationship('Presence', back_populates='member')

    def __repr__(self):
        return f"<Member {self.Name} {self.First_name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, Name, First_name, Adress, Gender, Phone, Image):
        self.Name = Name
        self.First_name = First_name
        self.Adress = Adress
        self.Gender = Gender
        self.Phone = Phone
        self.Image = Image
        db.session.commit()
    def add_to_group(self, group):

        if group not in self.groups:
            self.groups.append(group)
        else:
            raise ValueError("Le membre fait déjà partie de ce groupe.")
    
    def remove_from_all_groups(self):
        self.groups = []

