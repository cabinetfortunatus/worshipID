from app.configuration.exts import db
from app.modele.model_groups import Groups  
from app.modele.model_members import Members 

event_member = db.Table(
    'event_member',
    db.Column('event_id', db.Integer, db.ForeignKey('events.id'), primary_key=True),
    db.Column('member_id', db.Integer, db.ForeignKey('members.id'), primary_key=True)
)

event_group = db.Table(
    'event_group',
    db.Column('event_id', db.Integer, db.ForeignKey('events.id'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('groups.id'), primary_key=True)
)

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    Id_admin = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    Code_event = db.Column(db.String(30), nullable=False, unique=True) 
    Name_event = db.Column(db.String(50), nullable=False)
    Theme = db.Column(db.String(50), nullable=False)
    Date = db.Column(db.Date, nullable=False)  
    Duration = db.Column(db.String(10), nullable=False)  
    target_type = db.Column(db.String(20), nullable=False)  
    Id_group = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=True) 
    
    groups = db.relationship('Groups', secondary=event_group, back_populates='events')
    members = db.relationship('Members', secondary=event_member, back_populates='events')
    absences = db.relationship("Absence", back_populates="event")  
    presences = db.relationship('Presence', back_populates='event')  

    def __repr__(self):
        return f"<Event {self.Name_event}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, Name_event, Theme, Date, Duration, target_type, Id_group=None):
        self.Name_event = Name_event
        self.Theme = Theme
        self.Date = Date
        self.Duration = Duration
        self.target_type = target_type
        self.Id_group = Id_group  
        db.session.commit()

    def add_group(self, group_ids):
     
        groups_to_add = Groups.query.filter(Groups.id.in_(group_ids)).all()
        for group in groups_to_add:
            if group not in self.groups:
                self.groups.append(group)
        db.session.commit()

    def remove_group(self, group_id):
    
        group_to_remove = Groups.query.get(group_id)
        if group_to_remove in self.groups:
            self.groups.remove(group_to_remove)
        db.session.commit()

    def add_all_members(self):
    
        members = Members.query.all()  
        for member in members:
           
            if member not in self.members:
                self.members.append(member)
        db.session.commit()

    def add_member(self, member_id):
        
        member = Members.query.get(member_id)
        if member and member not in self.members:
            self.members.append(member)
        db.session.commit()

    def remove_member(self, member_id):
        
        member = Members.query.get(member_id)
        if member in self.members:
            self.members.remove(member)
        db.session.commit()
