from util.token import *
from database.follow import *
from database.auth import auth_get_user_info_by_userid

def get_user_profile(body, token):
    """
    Get user profile by giving userID
    """

    user_info = auth_get_user_info_by_userid(body['userID'])

    receiver = {
        'userID': body['userID']
    }

    if user_info == None:
        raise Exception("Invalid Input")
    
    if token != '':
        token_info = get_data_from_token(token)
        sender = {
            'userID': token_info['userID']
        }
        follow_info = check_following_relation(sender, receiver)

        resp = {
            "userName": user_info[0],
            "creditPoint": user_info[2],
            "isFollowed": follow_info['isFollowed']
        }
    else:
        resp = {
            "userName": user_info[0],
            "creditPoint": user_info[2],
        }


    return resp

    

def follow_services(follow_info, token):
    """
    Follows a user
        arg: 
            follow_info:
                reciverID: int
            token: string
        
        return:
            void
    """

    if validate_token(token) == False:
        raise Exception('Invalid Token')
    
    token_info = get_data_from_token(token)

    sender = {
        'userID': token_info['userID']
    }

    receiver = {
        'userID': follow_info['reciverID']
    }

    data = create_follow_relation(sender,receiver)

    if data == None:
        raise Exception("Invalid Input")
    
    return {}


def unfollow_services(unfollow_info, token):
    """
    Unfollows a user
        arg: 
            follow_info:
                reciverID: int
            token: string
        
        return:
            void
    """

    if validate_token(token) == False:
        raise Exception('Invalid Token')
    
    token_info = get_data_from_token(token)

    sender = {
        'userID': token_info['userID']
    }

    receiver = {
        'userID': unfollow_info['reciverID']
    }

    data = delete_follow_relation(sender,receiver)

    if data == None:
        raise Exception("Invalid Input")
    
    return {}
