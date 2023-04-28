from util.token import validate_token, get_data_from_token
from database.message import get_all_message_DB

def message_get_by_userid(body):
    messages = get_all_message_DB(body)

    if messages == None:
        raise Exception("Invalid Input")

    allMessages = []
    for message in messages:
        thisBooking = {
            'eventID': message[1],
            'string': message[2],
        }
        allMessages.append(thisBooking)

    print("messages returned:")
    print(allMessages)

    return {'message': allMessages}