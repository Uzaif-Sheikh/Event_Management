from util.token import get_token, validate_token
from database.auth import *
from database.tier import get_name_creditPoint_by_userID
from database.payment import get_latest_added_card_by_userID
import hashlib


def auth_login(user_info):
    '''
    user login logic is written is this function, this function
    check the given user info with existing entry in the database 
    and makes token for the user login session.
        Args:
            user_info:
                {
                    email: string,
                    password: string
                }
        
        return:
            {
                'userName': string
                'userID': int
                'creditPoint': int
                'token': string
                'cardNumber': int
                'cardName': string
                'expiryDate': string
                'cvv': int
            }
        
    '''

    password_encode = user_info['password'].encode('utf-8')
    hashed_pass = hashlib.sha256(password_encode).hexdigest()

    # --- call to DB
    user_obj = auth_get_user_info_by_email(user_info['email'])

    if not user_obj:
        raise Exception('Invalid Input')

    if hashed_pass != user_obj['password']:
        raise Exception('Invalid Input')

    token = get_token({
        'email': user_info['email'],
        'name': user_obj['name'],
        'userID': user_obj['userID']
    })

    data = get_name_creditPoint_by_userID(user_obj['userID'])
    if data == None:
        raise Exception('Invalid Input')

    card_info = get_latest_added_card_by_userID(user_obj['userID'])

    print(card_info)
    if card_info == None:
        return {
            'userName': user_obj['name'],
            'userID': user_obj['userID'],
            'creditPoint': data[1],
            'token': token,
            'cardNumber': '',
            'cardName': '',
            'expiryDate': '',
            'cvv': ''
        }

    return {
        'userName': user_obj['name'],
        'userID': user_obj['userID'],
        'creditPoint': data[1],
        'token': token,
        'cardNumber': card_info[2],
        'cardName': card_info[3],
        'expiryDate': card_info[4],
        'cvv': card_info[5]
    }

    


def auth_register(user_info):
    '''
    register logic goes here, this function create new user entry in the 
    database and makes token for the login session.
        Args:
            user_info:
                {
                    "email": string
                    "password": string
                    "name": string
                }
        
        return:
            {
                'userName': string
                'userID': int
                'creditPoint': int
                'token': string
            }
    '''
    
    password_encode = user_info['password'].encode('utf-8')
    hashed_pass = hashlib.sha256(password_encode).hexdigest()

    db_data = {
        'email': user_info['email'],
        'name': user_info['name'],
        'password': hashed_pass
    }

    # --- call to DB
    user_obj = auth_register_intoDB(db_data)

    if not user_obj:
        raise Exception('Invalid Input')

    token = get_token({
        'email': user_info['email'],
        'name': user_info['name'],
        'userID': user_obj['userID']
    })

    data = get_name_creditPoint_by_userID(user_obj['userID'])
    if data == None:
        raise Exception('Invalid Input')

    return {'userName': user_info['name'], 'userID': user_obj['userID'], 'creditPoint': data[1], 'token': token}


def auth_logout(token):
    '''
    Logout logic goes into this function
        Args:
            token: string
        
        return:
            {}
    '''
    if validate_token(token) == False:
        raise Exception('Invalid Token')

    return {}
