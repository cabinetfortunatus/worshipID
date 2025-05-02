from app.configuration.exts import db
from sqlalchemy.orm import relationship
class Members(db.Model):
    __tablename__ = 'members'
    
    id = db.Column(db.Integer(), primary_key=True)
    Name = db.Column(db.String(30), nullable=False)
    First_name = db.Column(db.String(30), nullable=False)
    Adress = db.Column(db.String(50), nullable=False)
    Gender = db.Column(db.String(10), nullable=False)
    Phone = db.Column(db.String(20), nullable=False)
    Image = db.Column(db.LargeBinary(), nullable=False)
    Score = db.Column(db.Float(10), nullable = True)

    users = relationship("Users", uselist=False, back_populates="member")
    groups = relationship('Groups', 
                        secondary='members_groups',
                        back_populates='members')
    
    events = db.relationship('Event', 
                           secondary='event_member',
                           back_populates='members')
    
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
    
    def update(self, Name, First_name, Adress, Gender, Phone, Image, Score):
        self.Name = Name
        self.First_name = First_name
        self.Adress = Adress
        self.Gender = Gender
        self.Phone = Phone
        self.Image = Image
        self.Score = Score
        db.session.commit()

    def add_to_group(self, group):
        if group not in self.groups:
            self.groups.append(group)
        else:
            raise ValueError("Le membre fait déjà partie de ce groupe.")
    
    def remove_from_all_groups(self):
        self.groups = []
        

    def remove_from_group(self, group):
        if group not in self.groups:
            raise ValueError("Le membre n'appartient pas à ce groupe.")
        self.groups.remove(group)
