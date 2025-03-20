from flask import request, jsonify
from flask_security import auth_required, current_user
from flask_restful import Resource
from ..models import Quiz, Question, UserQuiz, db

class SubmitQuizApi(Resource):

    @auth_required('token')
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
