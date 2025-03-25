from flask import Flask
from application.database import db
from application.models import User,Role
from application.resources.__init__ import *
from application.config import LocalDevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore
from werkzeug.security import check_password_hash, generate_password_hash
from application.celery_init import celery_init_app
from celery.schedules import crontab

from application.tasks import monthly_report

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    
    api.init_app(app)
    datastore = SQLAlchemyUserDatastore(db,User,Role)
    app.security = Security(app,datastore)
    app.app_context().push()
    return app

app = create_app()
celery = celery_init_app(app)
celery.autodiscover_tasks()

with app.app_context():
    db.create_all()
    app.security.datastore.find_or_create_role(name="admin", description="superuser")
    app.security.datastore.find_or_create_role(name="user", description="general user")
    
    if not app.security.datastore.find_user(email="admin@gmail.com"):
        app.security.datastore.create_user(email = "admin@gmail.com",
                                 password = generate_password_hash("1234"),
                                 roles = ['admin'],
                                 name="Admin", qualification="None",
                                 dob=datetime.strptime("2000-01-01", "%Y-%m-%d").date())
    
    db.session.commit()


from application.routes import *

@celery.on_after_finalize.connect 
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute = '*/2'),
        monthly_report.s(),
    )

if __name__ == "__main__":
    app.run()