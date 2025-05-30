#backend\mainapp\models.py
from flask_login import UserMixin 
from mainapp import db,login_manager
from sqlalchemy import Column, Integer, String, Float, Date, Boolean, Enum, ForeignKey, DateTime,UniqueConstraint
from datetime import datetime, timezone
import enum
from werkzeug.security import generate_password_hash, check_password_hash

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

class User(db.Model, UserMixin):
    id = db.Column(db.String(50), primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80))
    phone = db.Column(db.String(10), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_site_contractor = db.Column(db.Boolean, default=False)
    is_client = db.Column(db.Boolean, default=False) 
    


class Site_contructor(User):
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Full name, Not null
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80))
    phone = db.Column(db.String(10), nullable=False)  # Phone number, Not null
    address = db.Column(db.String(255), nullable=False)  # Address, Not null
    project_id = db.Column(db.String(50), db.ForeignKey('project.id'))  # Foreign Key
    salary = db.Column(db.Numeric(10, 2), nullable=False)





class Project(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), unique=False, nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(50), nullable=False)
    budget = db.Column(db.Numeric(10, 2), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    site_contractor_id = db.Column(db.String(50), db.ForeignKey('site_contructor.id'), nullable=True)
    client_id = db.Column(db.String(50), db.ForeignKey('user.id'), nullable=True)
    



