from util.token import *
from database.event import *
from database.review import get_all_review_by_eventID, get_all_reply_by_reviewID
from database.auth import auth_get_user_name_by_id
from database.recommendation import get_recommendation_by_userID
import json


def event_create(event_info, token):
    """
    This function creates a new event entry in the database.
        Args:
            event_info:
                {
                    "title": string
                    "organiserName": string
                    "organiserId": int
                    "eventType": string
                    "location": string
                    "startTimeandDate": string
                    "endTimeandDate": string
                    "banner": string
                    "description": string
                    "totalTicketQuantity": int
                    "ticketPrice": int
                }

            token: string
        
        return:
            {
                "eventId": int
            }
    """
    

    if validate_token(token) == False:
       raise Exception('Invalid Token')

    data = event_create_intoDB(event_info)    

    if data is None:
        raise Exception('Invalid Input')

    if 'banner' in event_info.keys() and event_info['banner'] != '':
        add_banner_to_event(data['eventID'], event_info['banner'])
        print('banner')
    else:
        print('no banner')
    return data


def event_getall():
    """
    This function gets all the event in the database.
        Args:
            void 
        
        return:
            {
                "events": [
                    {
                        "id": int
                        "title": string
                        "address": string
                        "startTimeandDate": string
                        "endTimeandDate": string
                        "banner": string
                    },
                    {
                        "id": int
                        "title": string
                        "address": string
                        "startTimeandDate": string
                        "endTimeandDate": string
                        "banner": string
                    }
                ]
            }
    """

    #call to db:
    data = event_getall_fromDB()
    res = []
    for i in range(len(data)):
        dict_obj = {
            "id": data[i][0],
            "title": data[i][1],
            "address": data[i][9],
            "availableTickets": data[i][7],
            "startTimeandDate": data[i][10],
            "endTimeandDate": data[i][11],
            "banner": data[i][12]
        }
        res.append(dict_obj)

    data = {"events": res}

    return data


def event_getbyid(event_id):
    """
    This function get event information using a eventID
        Args:
            event_id: int
        
        return:
            event_info:
            {
                "title": string,
                "organiserName": string
                "organiserId": int
                "eventType": string
                "location": string
                "startTimeandDate": string
                "endTimeandDate": string
                "banner": string
                "description": string
                "availableTicketQuantity": int
                "totalTicketQuantity": int
                "ticketPrice": int
                “review”: [
                    {"reviewId": int, "reviewerId": int, "reviewerName": string, "comment": string, "rating": int},
                    {"reviewId": int, "reviewerId": int, "reviewerName": string, "comment": string, "rating": int}
                ]
            }
    """

    #call to db:
    data = event_getfrom_id(event_id)

    if data == None:
        raise Exception("Invalid Input")

    reviews = get_all_review_by_eventID(event_id)
    processed_reviews = []
    
  
    for review in reviews:
        name = auth_get_user_name_by_id(review[2])
        replies = get_all_reply_by_reviewID(review[0])

        repliesList = []
        for reply in replies:
            replyDict = {
                'reply': reply[4],
                'replyTime': reply[3]
            }
            repliesList.append(replyDict)

    
        rev={
            "reviewId": review[0], 
            "reviewerId": review[2], 
            "reviewerName": name, 
            "comment": review[5], 
            "hostReply": repliesList,
            "rating": review[3]
        }
        processed_reviews.append(rev)
    
    
    res = {
        'id': data[0],
        "title": data[1],
        "organiserName": data[3],
        "organiserId": data[2],
        "eventType": data[4],
        "location": data[9],
        "startTimeandDate": data[10],
        "endTimeandDate": data[11],
        "banner": data[12],
        "description": data[8],
        "availableTicketQuantity": data[7],
        "totalTicketQuantity": data[6],
        "ticketPrice": data[5],
        "reviews": processed_reviews
    }
    
    return res

def event_edit_by_eventid(token, event_info, event_id):
    """
    Editing an event by using a particular event_id
        Args:
            token: string,
            event_id: int,
            event_info:
                {
                    "title": string
                    "organiserName": string
                    "organiserId": int
                    "eventType": string
                    "location": string
                    "startTimeandDate": string
                    "endTimeandDate": string
                    "banner": string
                    "description": string
                    "totalTicketQuantity": int
                    "ticketPrice": int
                }
        
        return:
            void 
    """

    if validate_token(token) == False:
       raise Exception('Invalid Token')
    
    # call to the database:
    data = update_event_by_eventId(event_id, event_info)

    if data == None:
        raise Exception("Invalid Input")

    

def event_getall_by_userid(userid):
    """
    Get all the event for a particular user:
        Args:
            userid: int
            
        return:
            {
                “events”: [
                            {
                                "id": int
                                "title": string
                                "address": string
                                "startTimeandDate": string
                                "endTimeandDate": string
                                "banner": string
                                "description": string
                                "totalTicketQuantity": int
                                "ticketPrice": int 
                            },
                            {
                                "id": int
                                "title": string
                                "address": string
                                "startTimeandDate": string
                                "endTimeandDate": string
                                "banner": string
                                "description": string
                                "totalTicketQuantity": int
                                "ticketPrice": int 
                            }
                ]
            }
    """

    # call to database
    data = event_getby_userID(userid)

    if data == None:
        raise Exception("Invalid Input")
    
    res = []
    for i in data:
        dict_obj = {
            "id": i[0],
            "title": i[1],
            "eventType": i[4],
            "address": i[9],
            "startTimeandDate": i[10],
            "endTimeandDate": i[11],
            "banner": ":(",
            "description": i[8],
            "totalTicketQuantity": i[6],
            "ticketPrice": i[5]
        }
        res.append(dict_obj)

    return {"events": res}

def event_get_attendees_for_event(token, eventID):
    """
    Get all the attendees for a event
        Args:
            token: string,
            eventID: int
        
        return:
            {
                'attendeeID': int
                'attendeeName': string
                'isFollowed': bool
            }
    """

    get_token_info = get_data_from_token(token)

    get_all_info = {
        "userID": get_token_info['userID'],
        "eventID": eventID 
    }
    
    data = get_following_attending_users(get_all_info)
    print(data)

    if data == None:
        raise Exception("Invalid Input")

    return data

def event_cancel_event(token, eventID):
    """
    Cancels an event using the eventid
        args:
            token: string,
            eventID: int
        
        return:
            void
    """
    res = delete_event_by_eventId(eventID)

    send_email(eventID)

    return(res)

# this function is intentionally left blank, but would be implemented if real emails were sent out
def send_email(eventID):
    return

def event_get_recommendations(userID):
    res = get_recommendation_by_userID(userID)

    modifiedRecommendations=[]

    for recommendation in res:
        rec = {
            "id": recommendation[0],
            "title": recommendation[1],
            "address": recommendation[9],
            "startTimeandDate": recommendation[10],
            "endTimeandDate": recommendation[11],
            "banner": recommendation[12]
        }
        modifiedRecommendations.append(rec)


    return(modifiedRecommendations)

