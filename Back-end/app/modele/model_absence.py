from app.configuration.exts import db

class Absence(db.Model):
    __tablename__ = 'absence' 

    id = db.Column(db.Integer(), primary_key=True)
    Id_event = db.Column(db.Integer(), db.ForeignKey('events.id'))
    Id_member = db.Column(db.Integer(), db.ForeignKey('members.id'))
    Motif = db.Column(db.Text(), nullable=True)

   
    event = db.relationship("Event", back_populates="absences")  
    member = db.relationship('Members', back_populates='absences')  

    def __repr__(self):
        return f"<Absence {self.Id_event} - {self.Id_member}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, Motif):
        self.Motif = Motif
        db.session.commit()