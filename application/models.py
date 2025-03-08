from .database import db
from flask_security import UserMixin, RoleMixin
from datetime import datetime
import pytz

IST = pytz.timezone("Asia/Kolkata")

def ist_time():
    return datetime.now(IST)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(50), unique = True, nullable = False)
    password = db.Column(db.String(30), nullable = False)
    
    name  = db.Column(db.String(30), nullable = False)
    qualification = db.Column(db.String(30), nullable = False)
    skills = db.Column(db.String(30))
    dob = db.Column(db.Date, nullable = False)
    
    fs_uniquifier = db.Column(db.String, unique = True, nullable = False)
    active = db.Column(db.Boolean, nullable = False)
    roles = db.relationship('Role', backref = 'bearer', secondary = 'user_roles')
    
    
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable = False)
    description = db.Column(db.String(100))
    
# many to many relation
class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
    
class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(30))
    # one to many relation
    chapters = db.relationship('Chapter', backref='subject', cascade="all, delete", lazy=True)
    
class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(30))
    subject_id = db.Column(db.Integer, db.ForeignKey("subject.id"), nullable = False)
    
    # one to many relation
    quizzes = db.relationship('Quiz', backref='chapter', cascade="all, delete", lazy = True)
    
    
class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey("chapter.id"), nullable = False)
    time_duration = db.Column(db.String(5), nullable=False)
    max_score = db.Column(db.Integer, nullable=False, default=100)
    passing_score = db.Column(db.Integer, nullable=False, default=40)
    difficulty_level = db.Column(db.String(20), default="Medium")
    questions = db.relationship('Question', backref='quiz', cascade="all, delete", lazy=True)
    
    
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id"), nullable = False)
    question_statement = db.Column(db.Text, nullable=False)
    option1 = db.Column(db.String(100), nullable=False)
    option2 = db.Column(db.String(100), nullable=False)
    option3 = db.Column(db.String(100), nullable=False)
    option4 = db.Column(db.String(100), nullable=False)
    correct_option = db.Column(db.Integer, nullable=False)
    
class UserQuiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=ist_time)
    score = db.Column(db.Integer, nullable=False)

    quiz = db.relationship('Quiz', backref='attempts')
