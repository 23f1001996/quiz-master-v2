from ..models import Chapter, Subject, Quiz
from flask_security import auth_required, roles_required, roles_accepted
from flask_restful import Resource, reqparse
from . import db
from ..tasks import quiz_update

parser = reqparse.RequestParser()
parser.add_argument('time_duration')
parser.add_argument('max_score')
parser.add_argument('passing_score')
parser.add_argument('difficulty_level')

class QuizApi(Resource):
    
    @auth_required('token')
    @roles_accepted('admin','user')
    def get(self, chapter_id):
        if chapter_id:
            chapter = Chapter.query.get(chapter_id)
            if not chapter:
                return {'message': 'Chapter not found'}, 404
            quizzes = chapter.quizzes
            quizzes_json = []
            for quiz in quizzes:
                quizzes_json.append({
                    'id': quiz.id,
                    'chapter_id': quiz.chapter_id,
                    'time_duration': quiz.time_duration,
                    'max_score': quiz.max_score,
                    'passing_score': quiz.passing_score,
                    'difficulty_level': quiz.difficulty_level,
                    'questions': len(quiz.questions),
                    'message': f'Showing chapters of: {chapter.name}'
                })
                
            if quizzes_json:
                return {
                    'quizzes': quizzes_json,
                    'chapter_name': chapter.name
                        }
            return {'message': 'No quizzes found'}
        
    @auth_required('token')
    @roles_required('admin')
    def post(self, chapter_id):
        args = parser.parse_args()
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return {'message': 'Chapter not found'}, 404
        try:
            quiz = Quiz(chapter_id=chapter_id, time_duration=args['time_duration'], max_score=args['max_score'],passing_score=args['passing_score'],difficulty_level=args['difficulty_level'])
            db.session.add(quiz)
            db.session.commit()
            result = quiz_update.delay(chapter.name)
            return {'message': 'Quiz created successfully!'}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error creating chapter: {str(e)}'}
        
    @auth_required('token')
    @roles_required('admin')
    def put(self, quiz_id):
        args = parser.parse_args()
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {'message': 'Quiz not found'}, 404
        try:
            quiz.time_duration = args['time_duration']
            quiz.max_score = args['max_score']
            quiz.passing_score = args['passing_score']
            quiz.difficulty_level = args['difficulty_level']
            db.session.commit()
            return {'message': 'Quiz updated successfully!'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error updating quiz: {str(e)}'}
        
    @auth_required('token')
    @roles_required('admin')
    def delete(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {'message': 'Quiz not found'}, 404
        try:
            db.session.delete(quiz)
            db.session.commit()
            return {'message': 'Quiz deleted!'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error deleting quiz: {str(e)}'}
        
