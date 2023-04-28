from database.connector import connection
from database.tier import calculate_credit_point_by_userID, update_creditPoint_by_userID

def generate_new_bookingID():
    db = connection()
    cursor = db.cursor()
    query = "SELECT MAX(bookingID) FROM booking"
    cursor.execute(query)
    current_max = cursor.fetchone()[0]
    if current_max is None:
        return 1
    else:
        return current_max + 1

def check_if_record_exist(bookingID):
    db = connection()
    cursor = db.cursor()
    print("ID given is: " + str(bookingID))
    query = "SELECT * FROM booking WHERE bookingID = %s" % (bookingID)
    cursor.execute(query)
    return cursor.fetchone()

def get_userID_by_bookingID(bookingID):
    db = connection()
    cursor = db.cursor()
    query = "SELECT userID FROM booking WHERE bookingID = %s" % (bookingID)
    cursor.execute(query)
    return cursor.fetchone()[0]

def get_eventID_by_bookingID(bookingID):
    db = connection()
    cursor = db.cursor()
    query = "SELECT eventID FROM booking WHERE bookingID = %s" % (bookingID)
    cursor.execute(query)
    return cursor.fetchone()[0]

def get_available_by_eventID(eventID):
    db = connection()
    cursor = db.cursor()
    query = "SELECT available FROM event WHERE eventID = %s" % (eventID)
    cursor.execute(query)
    return cursor.fetchone()[0]

def get_quantity_by_bookingID(bookingID):
    db = connection()
    cursor = db.cursor()
    query = "SELECT quantity FROM booking WHERE bookingID = %s" % (bookingID)
    cursor.execute(query)
    return cursor.fetchone()[0]

################################################################################

def create_booking_DB(booking_info):
    """ Registers a new user into the database.
        Args:
            booking_info: A dictionary containing the following keys
                booking_info = {
                    'eventID': The eventID of the event
                    'userID': The userID of the user who created the booking
                    'quantity': The quantity of tickets the user wants to book
                }
        Returns:
            None: If the available tickets is less than the quantity of tickets the user wants to book

            A dictionary containing the following keys
                return_data = {
                    'bookingID': The bookingID of the booking
                }
    """

    db = connection()
    cursor = db.cursor()

    available = get_available_by_eventID(booking_info['eventID'])
    if available < booking_info['quantity']:
        return None

    updateQuery = "UPDATE event SET available = available - %s WHERE eventID = %s"
    updateData = (booking_info['quantity'], booking_info['eventID'])

    bookingQuery = "INSERT INTO booking(bookingID, userID, eventID, quantity) VALUES (%s, %s, %s, %s)"
    bookingID = generate_new_bookingID()
    bookingData = (bookingID, booking_info['userID'], booking_info['eventID'], booking_info['quantity'])

    cursor.execute(updateQuery, updateData)
    cursor.execute(bookingQuery, bookingData)

    db.commit()

    credit_point = calculate_credit_point_by_userID(booking_info['userID'])
    update_creditPoint_by_userID(booking_info['userID'], credit_point)

    print(cursor.rowcount, "new booking created.")

    return {"bookingID": bookingID}

def delete_booking_DB(body):
    """ Deletes a booking from the database, and release tickets of this booking.
        Args:
            body: A dictionary containing the following keys
                body = {
                    bookingID': The bookingID of the booking
                }
        Returns:
            return_data: A dictionary containing the following keys
                body = {
                    bookingID': The bookingID of the booking
                }
    """
    db = connection()
    cursor = db.cursor()

    bookingID = body['bookingID']
    userID = get_userID_by_bookingID(bookingID)

    print("value passed into delet_booking_DB is: " + str(bookingID))

    print("return value of check is: " + str(check_if_record_exist(bookingID)))

    if check_if_record_exist(bookingID) is False:
        print("Booking does not exist.")
        return None

    eventID = get_eventID_by_bookingID(bookingID)
    ticket_quantity = get_quantity_by_bookingID(bookingID)
    deleteQuery = "DELETE FROM booking WHERE bookingID = %s"
    updateQuery = "UPDATE event SET available = available + %s WHERE eventID = %s"
    updateData = (ticket_quantity, eventID)

    cursor.execute(deleteQuery, [bookingID])
    cursor.execute(updateQuery, updateData)
    db.commit()

    print("ayylmao")

    credit_point = calculate_credit_point_by_userID(userID)
    update_creditPoint_by_userID(userID, credit_point)

    print("we got here")

    print(cursor.rowcount, "existing booking deleted.")
    return {"bookingID": bookingID}

def get_all_booking_DB(body):
    db = connection()
    cursor = db.cursor()
    query = "SELECT * FROM booking WHERE userID = %s" % (body['userID'])
    cursor.execute(query)
    return cursor.fetchall()
