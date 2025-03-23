from ..models import Chapter, Subject
from flask_security import auth_required, roles_required,roles_accepted
from flask_restful import Resource, reqparse
from . import db

parser = reqparse.RequestParser()
parser.add_argument('name')
parser.add_argument('description')
parser.add_argument('subject_id')

class ChapterApi(Resource):
    @auth_required('token')
    @roles_accepted('admin','user')
    def get(self, subject_id=None):
        if subject_id:
            subject = Subject.query.get(subject_id)
            if not subject:
                return {'message': 'Subject not found'}, 404
            chapters = subject.chapters
            chapters_json = []
            for chapter in chapters:
                chapters_json.append({
                    'id': chapter.id,
                    'name': chapter.name,
                    'description': chapter.description,
                    'message': f'Showing chapters of: {subject.name}'
                })
                
            if chapters_json:
                return {
                    'chapters': chapters_json,
                    'subject_name': subject.name
                }
            return {'message': 'No chapters found'}, 404
        
    @auth_required('token')
    @roles_required('admin')
    def post(self, subject_id):
        args = parser.parse_args()
        subject = Subject.query.get(subject_id)
        if not subject:
            return {'message': 'Subject not found'}, 404
        try:
            chapter = Chapter(name=args['name'], description=args['description'], subject_id=subject_id)
            db.session.add(chapter)
            db.session.commit()
            return {'message': 'Chapter created successfully!','chapter_id': chapter.id},201
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error creating chapter: {str(e)}'}, 400
    
    @auth_required('token')
    @roles_required('admin')
    def put(self, chapter_id):
        args = parser.parse_args()
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return {'message': 'Chapter not found'}, 404
        try:
            chapter.name = args['name']
            chapter.description = args['description']
            db.session.commit()
            return {'message': 'Chapter updated successfully!', 'chapter_id': chapter_id}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error updating chapter: {str(e)}'}, 400
        
    @auth_required('token')
    @roles_required('admin')
    def delete(self, chapter_id):
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return {'message': 'Chapter not found'}, 404
        try:
            db.session.delete(chapter)
            db.session.commit()
            return {'message': 'Chapter deleted!'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error deleting chapter: {str(e)}'}, 400

