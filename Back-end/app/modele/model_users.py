from app.configuration.exts import db

class Users(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer(), primary_key=True)
    id_admin = db.Column(db.Integer(), db.ForeignKey('admin.id'), nullable=True) 
    Username = db.Column(db.String(50), nullable=False)
    Image = db.Column(db.LargeBinary(), nullable = False)
    Password = db.Column(db.String(30), nullable=False)
    
    members = db.relationship('Members', back_populates='user', lazy = True)
    
    def __repr__(self):
        return f"<User {self.Username}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, Username=None,Image = None, Password=None):
        if Username:
            self.Username = Username
            
        if Image:
            self.Image = Image
            
        if Password:
            self.Password = Password
            
        
   
        db.session.commit()
