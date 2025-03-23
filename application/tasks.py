from celery import shared_task
from .models import *
import datetime
import csv

def format_timestamp(timestamp):
    if not timestamp:
        return "N/A"
    ist = pytz.timezone("Asia/Kolkata")
    return timestamp.astimezone(ist).strftime("%d/%m/%Y, %I:%M:%S %p")


@shared_task(ignore_results = False, name = "download_csv_report")
def csv_report(user_id):
    user_quiz = UserQuiz.query.filter_by(user_id = user_id).all()
    csv_file_name = f"quiz_details_{datetime.datetime.now().strftime("%f")}.csv"
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

# @shared_task(ignore_results = False, name = "monthly_report")
# def monthly_report():
#     users = User.query.all()
#     for user in users[1:]:
#         user_data = {}
#         user_data['username'] = user.username
#         user_data['email'] = user.email
#         user_trans = []
#         for transaction in user.trans:
#             this_trans = {}
#             this_trans["id"] = transaction.id
#             this_trans["name"] = transaction.name
#             this_trans["type"] = transaction.type
#             this_trans["source"] = transaction.source
#             this_trans["destination"] = transaction.destination
#             this_trans["delivery"] = transaction.delivery
#             this_trans["amount"] = transaction.amount
#             this_trans["user"] = transaction.bearer.username #/current_user.id 
#             user_trans.append(this_trans)
#         user_data['transactions'] = user_trans
#         message = format_report('templates/mail_details.html', user_data)
#         send_email(user.email, subject = "Monthly transaction Report - Fast Logistics", message = message)
#     return "Monthly reports sent"

# @shared_task(ignore_results = False, name = "delivery_update")
# def delivery_report():
#     return "The delivery is sent to user"