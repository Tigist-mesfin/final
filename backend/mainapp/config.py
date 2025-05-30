from dotenv import load_dotenv
import os




# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dtfghjhnkmuhvghcgddshkjygthf')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///ctmapp.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'amboconstruction264@gmail.com'
    MAIL_PASSWORD = 'vtsc petu euiz lqyw'
    MAIL_DEFAULT_SENDER = 'amboconstruction264@gmail.com'