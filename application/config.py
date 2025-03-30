class Config():
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATIONS = True
    
class LocalDevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///quiz.sqlite3'
    # SQLALCHEMY_ENGINE_OPTIONS = {"connect_args": {"check_same_thread": False, "foreign_keys": "ON"}}

    
    SECRET_KEY = 'my-secret-key'
    SECURITY_PASSWORD_HASH = "bcrypt" # mechanism for hashing password
    SECURITY_PASSWORD_SALT = "this-is-a-salt" 
    WTF_CSRF_ENABLED = False 
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
    
    CACHE_TYPE = 'RedisCache'
    CACHE_DEFAULT_TIMEOUT = 300
    CACHE_REDIS_HOST = 'localhost'
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 0
    CACHE_REDIS_URL = "redis://localhost:6379/0"
