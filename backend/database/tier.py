from math import floor
from database.connector import connection

def get_all_booking_and_ticket_price_by_userID(userID):
    db = connection()
    cursor = db.cursor()
    query = "SELECT booking.bookingID, booking.userID, booking.eventID, booking.quantity, event.price FROM booking INNER JOIN event WHERE booking.userID = %s AND booking.eventID = event.eventID" % (userID)
    cursor.execute(query)
    return cursor.fetchall()

def calculate_credit_point_by_userID(userID):
    db = connection()
    cursor = db.cursor()
    all_booking = get_all_booking_and_ticket_price_by_userID(userID)
    sum = 0
    for booking in all_booking:
        sum += booking[3] * booking[4]
    return floor(sum)

def calculate_tier_by_amount(amount):
    # Calculate the tier of the user based on the amount of credit points.
    if amount < 100:
        # Bronze: 0-99
        return 1
    elif amount < 500:
        # Silver: 100-499
        return 2
    elif amount < 2000:
        # Gold: 500-1999
        return 3
    else:
        # Diamond: 2000+
        return 4

def update_creditPoint_by_userID(userID, creditPoint):
    db = connection()
    cursor = db.cursor()
    query = "UPDATE user SET creditPoint = %s WHERE userID = %s"
    data = (creditPoint, userID)

    cursor.execute(query, data)
    db.commit()
    print("creditPoint:", creditPoint, "for userID:", userID, "set.")

def get_name_creditPoint_by_userID(userID):
    db = connection()
    cursor = db.cursor()
    query = "SELECT nickname, creditPoint FROM user WHERE userID = %s" % (userID)
    cursor.execute(query)
    return cursor.fetchone()
