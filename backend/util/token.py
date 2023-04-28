import jwt
from datetime import datetime, timedelta

SECRET_KEY = "UgjfRo-oTHoGNCtbAUFI4g"

def get_token(user_info):
    '''
    This function creates token:
        Args:
            user_info:
            {
                email: string,
                name: string,
                userid: int
            }
        
        return:
            token: string
    '''

    email = user_info['email']
    name = user_info['name']
    userid = user_info['userID']

    token = jwt.encode({
        "email":email,
        "name": name,
        "userID": userid
        }, SECRET_KEY, algorithm='HS256')
    return token

def validate_token(token):
    '''
    Checking if the token is valid or not.
        Args:
            token: string

        return:
            bool
    '''
    
    try:
        jwt.decode(token,SECRET_KEY, algorithms='HS256')
        return True
    except Exception as e:
        print("problem")
        print(str(e))
        return False

def get_data_from_token(token):
    '''
    Getting stored data from the token:
        Args:
            token: string
        
        return:
            user_info:
                {
                    email: string,
                    name: string,
                    userID: int
                }
    '''
    
    try:
        return jwt.decode(token,SECRET_KEY, algorithms='HS256')
    except:
        raise Exception("Invaild Token")