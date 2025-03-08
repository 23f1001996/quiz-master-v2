from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required,roles_required, roles_accepted, current_user,hash_password,login_user
from application.database import db
from application.models import User, Role, Subject, Chapter, Quiz, Question, UserQuiz

from werkzeug.security import check_password_hash, generate_password_hash

@app.route("/")
def index():
    return "Hello for now"