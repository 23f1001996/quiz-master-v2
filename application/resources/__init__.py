from flask_restful import Api
from ..models import *

from .subject_api import SubjectApi
from .chapter_api import ChapterApi
from .quiz_api import QuizApi
from .question_api import QuestionApi

api = Api()

api.add_resource(SubjectApi, '/api/subjects', '/api/subjects/<int:subject_id>')

api.add_resource(ChapterApi, 
                 '/api/chapters/get/<int:subject_id>',
                 '/api/chapters/create/<int:subject_id>',
                 '/api/chapters/update/<int:chapter_id>',
                 '/api/chapters/delete/<int:chapter_id>'
                 )

api.add_resource(QuizApi, 
                 '/api/quiz/get/<int:chapter_id>',
                 '/api/quiz/create/<int:chapter_id>',
                 '/api/quiz/update/<int:quiz_id>',
                 '/api/quiz/delete/<int:quiz_id>'
                 )

api.add_resource(QuestionApi,
                 '/api/questions/get/<int:quiz_id>',
                 '/api/questions/create/<int:quiz_id>',
                 '/api/questions/update/<int:question_id>',
                 '/api/questions/delete/<int:question_id>'
                 )


