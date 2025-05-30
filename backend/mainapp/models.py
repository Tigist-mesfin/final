#backend\mainapp\models.py
from flask_login import UserMixin 
from mainapp import db,login_manager
from sqlalchemy import Column, Integer, String, Float, Date, Boolean, Enum, ForeignKey, DateTime,UniqueConstraint
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash



@login_manager.user_loader
def load_user(user_id):
    # First, check the User table
    user = User.query.get(int(user_id))
    if user:
        return user

    # If not found in User table, check the Admin table
    admin = Construction_manager.query.get(int(user_id))
    return admin  # Return the first match




class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True, nullable=True )
    username = db.Column(db.String(80), unique=True, nullable=True)
    email = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80), nullable=True)
    phone = db.Column(db.String(10), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    salary = db.Column(db.Numeric(10, 2), nullable=True)
    role = db.Column(db.String(50), nullable=False, default="Client")

   



class Construction_manager(db.Model, UserMixin):
     id = db.Column(db.Integer, primary_key=True, autoincrement=True )
     username = db.Column(db.String(80), unique=True,nullable=False)
     password = db.Column(db.String(80),nullable=False)



class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    p_name = db.Column(db.String(100), unique=False, nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(50), nullable=False)
    budget = db.Column(db.Numeric(10, 2), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    TypeOfBuilding = db.Column(db.String(50), nullable=False) 
    Area = db.Column(db.Float, nullable=False)  # Area in square meters
    NumberOfFloors = db.Column(db.Integer, nullable=False)
    NumberOfRooms = db.Column(db.Integer, nullable=False)
    RoofType = db.Column(db.String(50), nullable=False)
    site_contractor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    client_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    progresses = db.relationship('ProjectProgress', backref='project', lazy=True)
    


class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(80), unique=True)
    phone = db.Column(db.String(10), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    salary = db.Column(db.Numeric(10, 2), nullable=False)
    p_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=True)
    site_cont_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    role = db.Column(db.String(50), nullable=False, default="Engineer") 
    



class Material(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=False, nullable=False)
    quantity = db.Column(db.Integer, nullable=False) 
    unit = db.Column(db.String(20))
    cost = db.Column(db.Numeric(10, 2), nullable=False) 
    p_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=True)
    site_cont_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)



class ProjectProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False)
    phase1 = db.Column(db.Boolean, default=False)
    phase2 = db.Column(db.Boolean, default=False)
    phase3 = db.Column(db.Boolean, default=False)
    p_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    site_cont_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    image_urls = db.Column(db.JSON)




class Request(db.Model):
    RequestID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserEmail = db.Column(db.String(255), nullable=False)
    Budget = db.Column(db.Numeric(15, 2), nullable=False)
    AdditionalDetails = db.Column(db.Text)
    Status = db.Column(db.Enum('Pending', 'Accepted','Approved', 'Rejected', name='status_enum'), default='Pending')
    Location = db.Column(db.String(255), nullable=False)  # New field for location
    TypeOfBuilding = db.Column(db.String(50), nullable=False) 
    Area = db.Column(db.Float, nullable=False)  # Area in square meters
    NumberOfFloors = db.Column(db.Integer, nullable=False)
    NumberOfRooms = db.Column(db.Integer, nullable=False)
    RoofType = db.Column(db.String(50), nullable=False)
    AdminReply = db.Column(db.String, nullable=True, default=None)

class WorkRequest(db.Model):
  

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(255), nullable=False)
    description_of_works = db.Column(db.Text, nullable=False)
    equipment_machinery = db.Column(db.String(255), nullable=True)
    date_of_inspection = db.Column(db.Date, nullable=False)
    Status = db.Column(db.Enum('Pending', 'Accepted','Approved', 'Rejected', name='status_enum'), default='Pending')
    site_cont_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    AdminReply = db.Column(db.String, nullable=True, default=None)





























