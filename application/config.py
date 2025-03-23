class Config():
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATIONS = True
    
class LocalDevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///quiz.sqlite3'
    
    SECRET_KEY = 'my-secret-key'
    SECURITY_PASSWORD_HASH = "bcrypt" # mechanism for hashing password
    SECURITY_PASSWORD_SALT = "this-is-a-salt" 
    WTF_CSRF_ENABLED = False 
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"