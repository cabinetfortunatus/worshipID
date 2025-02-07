from app.configuration.exts import db
from sqlalchemy.orm import relationship

class Users(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer(), primary_key=True)
    id_admin = db.Column(db.Integer(), db.ForeignKey('admin.id'), nullable=True)
    id_member = db.Column(db.Integer(), db.ForeignKey('members.id'), unique=True)
    Username = db.Column(db.String(50), nullable=False)
    Password = db.Column(db.String(30), nullable=False)
    
    
    
    # Relation avec Admin
    admin = db.relationship('Admin', 
                          back_populates='user',
                          foreign_keys=[id_admin])
    
    member = relationship("Members", uselist=False, foreign_keys=[id_member])

    def __repr__(self):
        return f"<Users {self.Username}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self, Username=None, Password=None):
        if Username:
            self.Username = Username
        if Password:
            self.Password = Password
        db.session.commit()