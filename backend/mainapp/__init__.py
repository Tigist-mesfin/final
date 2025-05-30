from flask import Flask
from mainapp.config import Config
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS
from flask_mail import Mail

from sqlalchemy import event
from sqlalchemy.engine import Engine
import sqlite3


# Initialize the Flask-Mail extensio
mail = Mail()

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_message_category = 'info'
migrate = Migrate()

def create_app(config_class=Config):
    
    app = Flask(__name__, static_folder='../frontend/public')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ProjectProgress.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config.from_object(config_class)
    CORS(app, supports_credentials=True)

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'amboconstruction264@gmail.com'
    app.config['MAIL_PASSWORD'] = 'vtsc petu euiz lqyw'
    app.config['MAIL_DEFAULT_SENDER'] = 'amboconstruction264@gmail.com'


    
    mail.init_app(app)











    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    # ✅ Import models AFTER db.init_app
    from mainapp import models

    # Register blueprints
    from mainapp.controllers.auth.route import auth
    app.register_blueprint(auth)

    from mainapp.controllers.admin.project import project
    app.register_blueprint(project)

    from mainapp.controllers.admin.employee import site_contractor
    app.register_blueprint(site_contractor)

    from mainapp.controllers.admin.client import client
    app.register_blueprint(client)

    from mainapp.controllers.admin.customer import customer
    app.register_blueprint(customer)

    from mainapp.controllers.site_contructor.employee2 import employee
    app.register_blueprint(employee)

    from mainapp.controllers.site_contructor.material import material
    app.register_blueprint(material)

    from mainapp.controllers.site_contructor.project_progress import progress_bp
    app.register_blueprint(progress_bp)



    return app


@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, sqlite3.Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=DELETE;")  # Changed from WAL to DELETE
        cursor.close()





        