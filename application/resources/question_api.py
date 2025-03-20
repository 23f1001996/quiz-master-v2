from ..models import Quiz,Question
from flask_security import auth_required, roles_required, roles_accepted
from flask_restful import Resource, reqparse
from . import db

parser = reqparse.RequestParser()
parser.add_argument('question_statement')
parser.add_argument('option1')
parser.add_argument('option2')
parser.add_argument('option3')
parser.add_argument('option4')
parser.add_argument('correct_option')

class QuestionApi(Resource):
    
    @auth_required('token')
    @roles_accepted('admin','user')
    def get(self, quiz_id):
        if quiz_id:
            quiz = Quiz.query.get(quiz_id)
            if not quiz:
                return {'message': 'Quiz not found'}, 404
            questions = quiz.questions
            questions_json = []
            for question in questions:
                questions_json.append({
                    'id': question.id,
                    'question_statement': question.question_statement,
                    'option1': question.option1,
                    'option2': question.option2,
                    'option3': question.option3,
                    'option4': question.option4,
                    'correct_option': question.correct_option
                })
                
            if questions_json:
                return {
                    "quiz": {
                    "id": quiz.id,
                    "time_duration": quiz.time_duration  # Ensure this is in "hh:mm" format
        },
        "questions": questions_json
                }
            return {'message':'No questions found'}
        
    
    @auth_required('token')
    @roles_required('admin')
    def post(self, quiz_id):
        args = parser.parse_args()
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {'message': 'Quiz not found'}, 404
        try:
            question = Question(question_statement=args['question_statement'],
                                option1=args['option1'],
                                option2=args['option2'],
                                option3=args['option3'],
                                option4=args['option4'],
                                correct_option=args['correct_option'],
                                quiz_id=quiz.id)
            db.session.add(question)
            db.session.commit()
            return {'message': 'Question added successfully'}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': 'Failed to add question'}, 400
        
        
    @auth_required('token')
    @roles_required('admin')
    def put(self, question_id):
        args = parser.parse_args()
        question = Question.query.get(question_id)
        if not question:
            return {'message': 'Question not found'}, 404
        try:
            question.question_statement = args['question_statement']
            question.option1 = args['option1']
            question.option2 = args['option2']
            question.option3 = args['option3']
            question.option4 = args['option4']
            question.correct_option = args['correct_option']
            db.session.commit()
            return {'message': 'Question updated successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'Failed to update question'}, 400
        
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, question_id):
        question = Question.query.get(question_id)
        if not question:
            return {'message': 'Question not found'}, 404
        try:
            db.session.delete(question)
            db.session.commit()
            return {'message': 'Question deleted!'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error deleting question: {str(e)}'}
        
        
                