from app.configuration.exts import db

class Presence(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    Id_event = db.Column(db.Integer(), db.ForeignKey('event.id'))
    Id_member = db.Column(db.Integer(), db.ForeignKey('members.id'))

    def __repr__(self):
        return f"<Presence {self.Id_event} - {self.Id_member}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    # def delete(self):
    #     db.session.delete(self)
    #     db.session.commit()
