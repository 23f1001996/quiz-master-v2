
from flask import request, jsonify
from flask_security import auth_required, current_user, roles_required, roles_accepted
from flask_restful import Resource
from ..models import IST, Quiz, Question, UserQuiz, db, Chapter, Subject

class ScoresApi(Resource):
    
    @auth_required('token')
    @roles_accepted('user','admin')
    def get(self):
        user = current_user
        scores = UserQuiz.query.filter_by(user_id = user.id).all()
        
        if not scores:
            return jsonify({'message': 'No scores found'}), 404
        
        scores_json = []
        for score in scores:
            quiz = Quiz.query.get( score.quiz_id)
            chapter = Chapter.query.get(quiz.chapter_id)
            subject = Subject.query.get(chapter.subject_id)
            scores_json.append({
                'score': score.score,
                'quiz': quiz.id,
                'chapter_name': chapter.name,
                'subject_name': subject.name,
                'timestamp': score.timestamp.strftime('%Y-%m-%d %H:%M:%S')
                })
            
            
        if scores_json:
            return {
                'scores': scores_json,
                'message': f'Showing scores of {user.name}'
            }
        
        return {'message': 'Attempt quizzes to view score'}

    @auth_required('token')
    @roles_required('user')
    def post(self, quiz_id):
        try:
            data = request.get_json()
            user_id = current_user.id
            answers = data.get('answers', {})

            # Check if quiz exists
            quiz = Quiz.query.get(quiz_id)
            if not quiz:
                return {"message": "Quiz not found"}, 404

            # Get correct answers
            correct_answers = {q.id: q.correct_option for q in quiz.questions}

            # Calculate score
            score = sum(1 for q_id, answer in answers.items() if correct_answers.get(int(q_id)) == int(answer))

            # Save user quiz attempt
            user_quiz = UserQuiz(user_id=user_id, quiz_id=quiz_id, score=score)
            db.session.add(user_quiz)
            db.session.commit()

            return {
                "message": "Quiz submitted successfully",
                "score": score,
                "total_questions": len(correct_answers),
                "correct_answers": correct_answers
            }, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500


class QuizResultApi(Resource):

    @auth_required('token')
    @roles_required('user')
    def get(self, quiz_id):
        """
        Fetch quiz results for a user.
        """
        user_id = current_user.id
        user_quiz = UserQuiz.query.filter_by(user_id=user_id, quiz_id=quiz_id).first()

        if not user_quiz:
            return {"message": "Quiz results not found"}, 404

        quiz = Quiz.query.options(db.joinedload(Quiz.questions)).get(quiz_id)
        if not quiz:
            return {"message": "Quiz not found"}, 404

        correct_answers = {q.id: q.correct_option for q in quiz.questions}

        return {
            "questions": [
                {
                    "id": q.id, 
                    "question_statement": q.question_statement, 
                    "option1": q.option1, 
                    "option2": q.option2, 
                    "option3": q.option3, 
                    "option4": q.option4
                }
                for q in quiz.questions
            ],
            "correct_answers": correct_answers,
            "score": user_quiz.score
        }, 200
