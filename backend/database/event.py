from database.connector import connection
from database.follow import get_followings
from database.review import get_all_review_by_eventID, delete_all_reply_by_reviewID

def generate_new_event_id():
    db = connection()
    cursor = db.cursor()
    query = "SELECT MAX(eventID) FROM event"
    cursor.execute(query)
    current_max = cursor.fetchone()[0]
    if current_max is None:
        return 1
    else:
        return current_max + 1

def get_capacity_and_available_tickets(event_id):
    db = connection()
    cursor = db.cursor()
    query = "SELECT capacity, available FROM event WHERE eventID = '%s'" % (event_id)
    cursor.execute(query)
    return cursor.fetchone()

def check_if_event_exists(eventID):
    db = connection()
    cursor = db.cursor()
    query = "SELECT * FROM event WHERE eventID = %s" % (eventID)
    cursor.execute(query)
    return cursor.fetchone() is not None

################################################################################

def event_create_intoDB(db_data):
    """ Create a new event into the database.
        Args:
            db_data: A dictionary containing the following keys
                db_event_create = {
                    "title": "Capybara 🦦",
                    "organiserName": "Fiona",
                    "organiserId": 1000,
                    "eventType": "Food",
                    "location": "UNSW",
                    "startTimeandDate": "2042-02-09 02:30:00",
                    "endTimeandDate": "2042-02-10 12:30:00",
                    "banner": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
                    "description": "Learn how to train capybara, cause Capy >> llama.",
                    "totalTicketQuantity": 4,
                    "ticketPrice": 20,
                }
        Returns:
            A dictionary containing the following keys
                return_data = {
                    'eventID': The eventID of the newly created event
                }
    """
    print(db_data, "indb")
    db = connection()
    cursor = db.cursor()

    query = "INSERT INTO event(eventID, eventName, hostID, hostName, eventType, price, capacity, available, description, location, startTime, endTime) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

    eventID = generate_new_event_id()
    available = db_data["totalTicketQuantity"]

    data = (eventID, db_data['title'], db_data['organiserId'], db_data['organiserName'], db_data['eventType'], db_data['ticketPrice'], db_data['totalTicketQuantity'], available, db_data['description'], db_data['location'], db_data['startTimeandDate'], db_data['endTimeandDate'])

    cursor.execute(query, data)
    db.commit()
    print(cursor.rowcount, "new event created.")

    return {"eventID": eventID}

def event_getall_fromDB():
    db = connection()
    cursor = db.cursor()
    query = "SELECT * FROM event"
    cursor.execute(query)
    return cursor.fetchall()

def event_getfrom_id(eventID):
    db = connection()
    cursor = db.cursor()
    query = "SELECT * FROM event WHERE eventID = '%s'" % (eventID)
    cursor.execute(query)
    return cursor.fetchone()

def event_getby_userID(userID):
    db = connection()
    cursor = db.cursor()
    query = "SELECT * FROM event WHERE hostID = '%s'" % (userID)
    cursor.execute(query)
    return cursor.fetchall()

def update_event_by_eventId(event_id, event_info):
    db = connection()
    cursor = db.cursor()

    data = get_capacity_and_available_tickets(event_id)
    original_capacity = data[0]
    original_available = data[1]

    if event_info["totalTicketQuantity"] == original_capacity:
        available = original_available
    else:
        available = event_info["totalTicketQuantity"]

    query = "UPDATE event SET eventName = %s, hostID = %s, hostName = %s, eventType = %s, price = %s, capacity = %s, available = %s, description = %s, location = %s, startTime = %s, endTime = %s WHERE eventID = %s"

    data = (event_info['title'], event_info['organiserId'], event_info['organiserName'], event_info['eventType'], event_info['ticketPrice'], event_info['totalTicketQuantity'], available, event_info['description'], event_info['location'], event_info['startTimeandDate'], event_info['endTimeandDate'], event_id)

    cursor.execute(query, data)
    db.commit()
    print(cursor.rowcount, "event updated.")

    return {}

def add_banner_to_event(event_id, banner):
    """ Add / change a banner to an event.
        Args:
            event_id: The eventID of the event to add the banner to.
            banner: The banner to add to the event, in URL format.
        Returns:
            None
    """
    db = connection()
    cursor = db.cursor()
    query = "UPDATE event SET banner = %s WHERE eventID = %s"
    data = (banner, event_id)
    cursor.execute(query, data)
    db.commit()
    print(cursor.rowcount, "banner added.")

def get_all_attending_users(eventID):
    """ Get ALL users attending an event by eventID.
    """
    db = connection()
    cursor = db.cursor()
    query = "SELECT user.userID, user.nickname, 0 AS isFollowed FROM booking JOIN user ON booking.userID = user.userID WHERE eventID = '%s'" % (eventID)
    cursor.execute(query)
    return cursor.fetchall()

def get_following_attending_users(get_attendee_info):
    """ Get all userID and userName attending an event if the specific user follows them.
        Args:
            get_attendee_info: dict with userID and eventID
            ex:
            {
                "userID": 34542,
                "eventID": 54646
            }
        Returns:
            A list of dictionaries containing the following keys
                return_data = {
                    'attendeeID': The userID of the user attending the event from table booking.
                    'attendeeName': The first name of the user attending the event from table user.
                    'isFollowed': If the attendee is being followed by the user
                }
                ex:
                [
                    {
                        ‘attendeeID’: 3,
                        ‘attendeeName’ : ‘Jannet’,
                        isFollowed : False
                    },
                    {
                        ‘attendeeID’: 4,
                        ‘attendeeName’ : ‘Alice’,
                        isFollowed : True
                    }
                ]
    """
    attendees = get_all_attending_users(get_attendee_info['eventID'])
    following = get_followings(get_attendee_info['userID'])
    followingIDs = []
    for follow in following:
        followingIDs.append(follow['userID'])
    list_of_attendees = []
    for attendee in attendees:
        if attendee[0] in followingIDs:
            isFollowed = True
        else:
            isFollowed = False
        attendee_dict = {
            'attendeeID': attendee[0],
            'attendeeName': attendee[1],
            'isFollowed': isFollowed
        }
        list_of_attendees.append(attendee_dict)
    return list_of_attendees

def delete_event_by_eventId(eventID):
    db = connection()
    cursor = db.cursor()

    if check_if_event_exists(eventID) is False:
        print("Event does not exist.")
        return None


    messageQuery = "SELECT * FROM booking WHERE eventID = %s" % eventID
    cursor.execute(messageQuery)

    record = cursor.fetchall()

    print("trying this out: ")

    users = []

    for user in record:
        if(user[1] not in users):
            messageQuery = "INSERT INTO messages(userID, eventID, string) VALUES (%s, %s, %s)"
            message = "We're sorry, Event " + str(eventID) + " has been cancelled :(. Your money has been refunded to you."

            print(message)

            messageData = (user[1],eventID,message)
            print("try here")
            cursor.execute(messageQuery,messageData)
            print("executed here")
        users.append(user[1])

    reviews = get_all_review_by_eventID(eventID)
    for review in reviews:
        delete_all_reply_by_reviewID(review[0])

    eventQuery = "DELETE FROM event WHERE eventID = '%s'" % (eventID)
    bookingQuery = "DELETE FROM booking WHERE eventID = '%s'" % (eventID)
    reviewQuery = "DELETE FROM review WHERE eventID = '%s'" % (eventID)

    cursor.execute(eventQuery)
    cursor.execute(bookingQuery)
    cursor.execute(reviewQuery)

    db.commit()
    print("EventID:", eventID, "and all related bookings, related reviews and replys are deleted.")
    return {'eventID': eventID}

def set_vipPrice_by_eventId(eventID, vipPrice):
    db = connection()
    cursor = db.cursor()

    if check_if_event_exists(eventID) is False:
        print("Event does not exist.")
        return None

    query = "UPDATE event SET vipPrice = %s WHERE eventID = %s"
    data = (vipPrice, eventID)
    cursor.execute(query, data)
    db.commit()
    print(cursor.rowcount, "VIP price updated.")
    return {}

def reset_vipPrice_by_eventId(eventID):
    db = connection()
    cursor = db.cursor()

    if check_if_event_exists(eventID) is False:
        print("Event does not exist.")
        return None

    query = "UPDATE event SET vipPrice = NULL WHERE eventID = %s"
    data = (eventID)
    cursor.execute(query, data)
    db.commit()
    print(cursor.rowcount, "VIP price reset.")
    return {}
