from ..models import *
from flask_security import auth_required, roles_required, roles_accepted
from flask_restful import Resource, reqparse

parser = reqparse.RequestParser()

parser.add_argument('name')
parser.add_argument('description')

        
class SubjectApi(Resource):
    @auth_required('token')
    @roles_accepted('admin','user')
    def get(self):
        subjects = Subject.query.all()
        subjects_json = []
        for subject in subjects:
            subjects_json.append({
                'id': subject.id,
                'name': subject.name,
                'description': subject.description,
                'message': 'showing all subjects'
            })
        if subjects_json:
            return subjects_json
        return {'message': 'No subjects found'}, 404

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = parser.parse_args()
        try:
            subject = Subject(name=args['name'], description=args['description'])
            db.session.add(subject)
            db.session.commit()
            return {'message': 'Subject created successfully!'}, 201
        except Exception as e:
            return {'message': f'Error creating subject: {str(e)}'}, 400
        
    @auth_required('token')
    @roles_required('admin')
    def put(self, subject_id):
        args = parser.parse_args()
        subject = Subject.query.get(subject_id)
        if subject:
            subject.name = args['name']
            subject.description = args['description']
            db.session.commit()
            return {'message': 'Subject updated successfully!'}, 200
        return {'message': 'Subject not found'}, 404
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, subject_id):
        subject = Subject.query.get(subject_id)
        if subject:
            db.session.delete(subject)
            db.session.commit()
            return {'message': 'Subject deleted!'}, 200
        return {'message': 'Subject not found'}, 404
    