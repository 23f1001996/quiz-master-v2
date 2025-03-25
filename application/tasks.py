from celery import shared_task
from .models import *
from datetime import datetime
import csv
from jinja2 import Template
from sqlalchemy.sql import extract
from .mail import send_email
import requests

def format_report(html_template, data):
    with open(html_template) as file:
        template = Template(file.read())
        return template.render(data = data)

def format_timestamp(timestamp):
    if not timestamp:
        return "N/A"
    ist = pytz.timezone("Asia/Kolkata")
    return timestamp.astimezone(ist).strftime("%d/%m/%Y, %I:%M:%S %p")


@shared_task(ignore_results = False, name = "download_csv_report")
def csv_report(user_id):
    user_quiz = UserQuiz.query.filter_by(user_id = user_id).all()
    csv_file_name = f"quiz_details_{datetime.now().strftime("%f")}.csv"
    with open(f'static/{csv_file_name}', 'w', newline = "") as csvfile:
        sr_no = 1
        quiz_csv = csv.writer(csvfile, delimiter = ',')
        quiz_csv.writerow(['Sr No.', 'Quiz id', 'Chapter name', 'Subject name', 'Score', 'Attempted at'])
        for s in user_quiz:
            quiz = Quiz.query.get(s.quiz_id)
            chapter = Chapter.query.get(quiz.chapter_id)
            subject = Subject.query.get(chapter.subject_id)
            this_quiz = [sr_no, s.quiz_id, chapter.name, subject.name, s.score, format_timestamp(s.timestamp)]
            quiz_csv.writerow(this_quiz)
            sr_no += 1

    return csv_file_name

IST = pytz.timezone("Asia/Kolkata")

def ist_now():
    return datetime.now(IST)

@shared_task(ignore_results=False, name="monthly_report")
def monthly_report():
    users = User.query.all()
    current_month = ist_now().month
    current_year = ist_now().year

    for user in users:
        user_quizzes = UserQuiz.query.filter(
            UserQuiz.user_id == user.id,
            extract('month', UserQuiz.timestamp) == current_month,
            extract('year', UserQuiz.timestamp) == current_year
        ).all()

        if not user_quizzes:
            continue  # Skip users with no quizzes this month

        total_quizzes = len(user_quizzes)
        total_score = sum(quiz.score for quiz in user_quizzes)
        average_score = total_score / total_quizzes if total_quizzes else 0

        user_data = {
            "username": user.name,
            "email": user.email,
            "total_quizzes": total_quizzes,
            "average_score": f"{average_score:.2f}",
            "quizzes": [
                {
                    "quiz_id": quiz.quiz_id,
                    "score": quiz.score,
                    "timestamp": quiz.timestamp.strftime("%d/%m/%Y, %I:%M %p"),
                    "quiz_name": Chapter.query.get(Quiz.query.get(quiz.quiz_id).chapter_id).name if Quiz.query.get(quiz.quiz_id) else "Unknown"
                }
                for quiz in user_quizzes
            ],
        }

        message = format_report("templates/mail_details.html", user_data)
        send_email(user.email, subject="Monthly Quiz Activity Report", message=message)

    return "Monthly quiz reports sent successfully!"


@shared_task(ignore_results = False, name = "new_quiz")
def quiz_update(chapter_name):
    text = f"Hello!, new quiz has been added to {chapter_name}.Please check 127.0.0.1.5000"
    response = requests.post("https://chat.googleapis.com/v1/spaces/AAAAZykjB-g/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=P4jIhztLjF0vC_cJf5pV-liMQjKQ-ctpCUHok2pAaJU", json = {"text": text})
    return "Quiz update"