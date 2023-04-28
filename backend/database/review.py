from database.connector import connection
from datetime import datetime

def generate_new_reviewID():
    db = connection()
    cursor = db.cursor()
    query = "SELECT MAX(reviewID) FROM review"
    cursor.execute(query)
    current_max = cursor.fetchone()[0]
    if current_max is None:
        return 1
    else:
        return current_max + 1

def generate_new_replyID():
    db = connection()
    cursor = db.cursor()
    query = "SELECT MAX(replyID) FROM reply"
    cursor.execute(query)
    current_max = cursor.fetchone()[0]
    if current_max is None:
        return 1
    else:
        return current_max + 1

################################################################################

def create_review_DB(review_info):
    db = connection()
    cursor = db.cursor()

    reviewQuery = "INSERT INTO review(reviewID, eventID, userID, rating, reviewTime, comment) VALUES (%s, %s, %s, %s, %s, %s)"
    reviewID = generate_new_reviewID()
    now = datetime.now()
    current_datetime = now.strftime('%Y-%m-%d %H:%M:%S')
    reviewData = (reviewID, review_info['eventID'], review_info['userID'], review_info['rate'], current_datetime, review_info['comment'])

    cursor.execute(reviewQuery, reviewData)

    db.commit()
    print(cursor.rowcount, "new review created.")

    return {"reviewID": reviewID}

def get_all_review_by_eventID(eventID):
    db = connection()
    cursor = db.cursor()
    query = "SELECT * FROM review WHERE eventID = %s" % (eventID)
    cursor.execute(query)
    return cursor.fetchall()

def reply_review_DB(reply_info):
    db = connection()
    cursor = db.cursor()

    replyQuery = "INSERT INTO reply(replyID, reviewID, userID, replyTime, comment) VALUES (%s, %s, %s, %s, %s)"
    replyID = generate_new_replyID()
    now = datetime.now()
    current_datetime = now.strftime('%Y-%m-%d %H:%M:%S')
    replyData = (replyID, reply_info['reviewID'], reply_info['userID'],current_datetime, reply_info['comment'])

    cursor.execute(replyQuery, replyData)

    db.commit()
    print(cursor.rowcount, "new reply to review", reply_info['reviewID'], "created.")

    return {"replyID": replyID}

def get_all_reply_by_reviewID(reviewID):
    db = connection()
    cursor = db.cursor()
    query = "SELECT * FROM reply WHERE reviewID = %s" % (reviewID)
    cursor.execute(query)
    return cursor.fetchall()

def delete_all_reply_by_reviewID(reviewID):
    db = connection()
    cursor = db.cursor()
    query = "DELETE FROM reply WHERE reviewID = %s" % (reviewID)
    cursor.execute(query)
    db.commit()
    print(cursor.rowcount, "reply deleted.")
