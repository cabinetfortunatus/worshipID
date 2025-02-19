from decouple import config
import os
class Config:
    SECRET_KEY=config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS',cast=bool)
    
class DevConfig(Config):
    
    #SQLALCHEMY_DATABASE_URI = 'mysql://root:''@localhost/face_recognize'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True 
    SQLALCHEMY_ECHO = True 