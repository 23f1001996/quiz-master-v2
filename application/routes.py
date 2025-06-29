from flask import current_app as app, jsonify, request, render_template, send_from_directory
from flask_security import auth_required,roles_required, roles_accepted, current_user,hash_password,login_user,logout_user
from application.database import db, cache
from application.models import User, Role, Subject, Chapter, Quiz, Question

from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime 

from celery.result import AsyncResult
from .tasks import csv_report

cache.set("test_key", "Hello, Redis!")

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static', 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route("/")
def index():
    return render_template('index.html')

from flask import jsonify
from flask_security import auth_required, current_user

@app.route('/api/user', methods=['GET'])
# @cache.cached(timeout=300, key_prefix='user_data')
@auth_required('token')
@roles_accepted('user','admin')
def get_user():
    user = current_user
    return jsonify({
        "name": user.name,
        "email": user.email,
        "role": user.roles[0].name,
        "qualification": user.qualification,
        "skills": user.skills,
        "dob": user.dob
    })


@app.route('/api/login', methods=['POST'])
def user_login():
    body = request.get_json()
    email = body['email']
    password = body['password']
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    user = app.security.datastore.find_user(email=email)
    if user:
        if check_password_hash(user.password, password):
            login_user(user)
            return jsonify({
                'message': 'Logged in successfully',
                "id": user.id,
                "email": user.email,
                "role": user.roles[0].name,
                "auth-token": user.get_auth_token()
            })
        else:
            return jsonify({'message': 'Invalid password'}), 400
    else:
        return jsonify({'message': 'User not found'}), 404

@app.route('/api/logout', methods = ['POST'])
@auth_required('token')
def user_logout():
    user = current_user
    logout_user()
    return jsonify({
        "message": "User logged out"
    })
    


@app.route('/api/register', methods=['POST'])
def create_user():
    credentials = request.get_json()

    # Check if user already exists
    if app.security.datastore.find_user(email=credentials["email"]):
        return jsonify({"message": "User already exists!"}), 400
    
    required_fields = ["email", "name", "password", "qualification", "skills", "dob"]
    if not all(credentials.get(field) for field in required_fields):
        return jsonify({"message": "All fields are required!"}), 400
        
    # Convert DOB string to date object
    dob = datetime.strptime(credentials["dob"], "%Y-%m-%d").date()

    # Create new user
    app.security.datastore.create_user(
        email=credentials["email"],
        name=credentials["name"],
        password=generate_password_hash(credentials["password"]),
        qualification=credentials["qualification"],
        skills=credentials["skills"],
        dob=dob,  # Ensure it's a date object
        roles=['user']
    )
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

@app.route('/api/export') # this manually triggers the job
def export_csv():
    result = csv_report.delay(current_user.id) # async object
    return jsonify({
        "id": result.id,
        "result": result.result,

    })

@app.route('/api/csv_result/<id>') # just create to test the status of result
def csv_result(id):
    res = AsyncResult(id)
    return send_from_directory('static', res.result)


@app.route('/api/toggle_active/<int:user_id>', methods=['POST'])
@auth_required('token')
def toggle_active(user_id):
    # Fetch the user from the database
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Toggle the user's active status
    user.active = not user.active
    db.session.commit()
    
    # Prepare a message indicating the new status
    status = "activated" if user.active else "deactivated"
    
    return jsonify({
        "message": f"User {user_id} has been successfully {status}.",
        "active": user.active  # Send the new status to update the frontend correctly
    }), 200



@app.route('/api/users', methods = ["GET"])
@auth_required('token')
@roles_required('admin')
def get_users():
    users = User.query.all()
    user_json = []
    for user in users:
        user_json.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.roles[0].name,
            "qualification": user.qualification,
            "skills": user.skills,
            "dob": user.dob,
            "active" : user.active
        })
        
    if user_json:
        return jsonify(user_json)
    
    return jsonify({
        "message": "Users not found"
    })