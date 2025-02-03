from app.configuration.exts import db

class Presence(db.Model):
    __tablename__ = 'presence'  

    id = db.Column(db.Integer(), primary_key=True)
    Id_event = db.Column(db.Integer(), db.ForeignKey('events.id'))
    Id_member = db.Column(db.Integer(), db.ForeignKey('members.id'))

    event = db.relationship('Event', back_populates='presences', lazy=True)  
    member = db.relationship('Members', back_populates='presences', lazy=True) 

    def __repr__(self):
        return f"<Presence {self.Id_event} - {self.Id_member}>"

    def save(self):
        db.session.add(self)
        db.session.commit()