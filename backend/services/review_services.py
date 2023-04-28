from util.token import *
from database.review import create_review_DB, reply_review_DB

def create_review_service(review_info, token):
    """
    Create review for an event:
        args:
            review_info:
                {
                    "eventid": 233245,
                    "userid": 3564,
                    "comment": Nice Event,
                    "rate": 4
                }
            token: string
        
        return:
            {
                "reviewid": 78204786
            }
    """
    

    # check token validity
    if validate_token(token) == False:
        raise Exception("Invalid Token")

    # DB function call here:
    
    data = create_review_DB(review_info)

    if data == None:
        raise Exception("Invalid Input")
        
    return data

def create_review_reply(body_info, token):
    """
    Reply to a review logic:
        args:
            body_info:
                {
                    'userID': 35645,
                    'reply': 'nice event',
                    'reviewID': 5785
                }
            token: string
        
        return:
            {
                replyID: 324564
            }
    """
 
    if validate_token(token) == False:
        raise Exception("Invalid Token")
    
    token_info = get_data_from_token(token)


    reply_info = {
        'userID': token_info['userID'],
        'comment': body_info['reply'],
        'reviewID': body_info['reviewID']
    }

    # call to the db function:
    data = reply_review_DB(reply_info)
    print(data, 57)


    if data == None:
        raise Exception("Invalid Input")
        
    return data