from util.token import validate_token, get_data_from_token
from database.booking import create_booking_DB, delete_booking_DB, get_all_booking_DB
from database.event import event_getfrom_id
from database.payment import add_card_DB

def booking_create(booking_info, bank_info, token):
    """
    This function, creates a new entry for event booking for a user
    in the database.
        Args:
            booking_info:
                {
                    eventID: int,
                    userID: int,
                    quantity: int
                } 
            bank_info:
                {
                    'userID': int
                    'cardNumber': int
                    'cardName': string
                    'expiryDate': string
                    'cvv': int
                }
            token: string
        
        return:
            {
            'bookingID': int
            }
    """
    # check token validity
    if validate_token(token) == False:
      raise Exception("Invalid Token")
    
    token_info = get_data_from_token(token)

    # call to db
    data = create_booking_DB(booking_info)

    if data == None:
        raise Exception("Invalid Input")
    

    d = add_card_DB(bank_info)
    if d == None:
        raise Exception("Invalid Input")
        

    return data

def booking_delete(body, token):
    """
    This function, deleted the booking made by a user from the 
    database.
        Args:
            body:
                {
                    bookingID: int
                } 
            token: string
        
        return:
            void
    """
    

    # check token validity
    if validate_token(token) == False:
       raise Exception("Invalid Token")

    # DB function call here:
    data = delete_booking_DB(body)

    if data == None:
        raise Exception("Invalid Input")

    return

def booking_get_by_userid(body):
    """
    This function gets all the booking for a given user.

        Args:
            body:
                {
                    userID: int
                }
        
        return:
            {
                “Booking”: [
                {
                    “id”: int
                    “eventid”: int
                    “title”: string
                    "startTimeandDate": string
                    "endTimeandDate": string
                    “quantity”: int
                    },
                ]
            }
    """

    # DB function call here:
    bookings = get_all_booking_DB(body)

    if bookings == None:
        raise Exception("Invalid Input")

    allbookings = []
    for booking in bookings:
        eventInfo = event_getfrom_id(booking[2])

        thisBooking = {
            'id': booking[0],
            'eventID': booking[2],
            'title': eventInfo[1],
            "startTimeandDate": eventInfo[10],
            "endTimeandDate": eventInfo[11],
            'quantity': booking[3]
        }
        allbookings.append(thisBooking)

    return {'bookings': allbookings}
