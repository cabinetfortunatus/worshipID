from app.configuration.exts import db

class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer(), primary_key = True)
    Username = db.Column(db.String(50), nullable = False, unique = True)
    Password = db.Column(db.Text(), nullable = False)
    Image = db.Column(db.LargeBinary(), nullable = False)
    Permission = db.Column(db.String(20), nullable = False)
    
    events = db.relationship('Event', backref = 'admin', lazy =True)
    groups = db.relationship('Groups', backref = 'admin', lazy = True)
    
    def __repr__(self):
        return f"<Admin> {self.Username}"
    
    def save(self):
        db.session.add(self)
        db.commit()
    def delete(self):
        db.session.delete(self)
        db.commit()    
    def update(self,Username,Password,Image,Permission):
        
        self.Username = Username
        self.Password = Password
        self.Image = Image
        self.Permission = Permission
        db.commit()
        
