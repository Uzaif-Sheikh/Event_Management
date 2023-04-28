from database.connector import connection

def get_user_id(email):
    db = connection()
    cursor = db.cursor()
    query = "SELECT userID FROM user WHERE email = '%s'" % (email)
    cursor.execute(query)
    return cursor.fetchone()[0]

def generate_new_userID():
    db = connection()
    cursor = db.cursor()
    query = "SELECT MAX(userID) FROM user"
    cursor.execute(query)
    current_max = cursor.fetchone()[0]
    if current_max is None:
        return 1
    else:
        return current_max + 1

################################################################################

def auth_register_intoDB(db_data):
    """ Registers a new user into the database.
        Args:
            db_data: A dictionary containing the following keys
                db_data = {
                    'email': The email of the user
                    'name': The name of the user
                    'password': The hashed password of  the user
                }
        Returns:
            A dictionary containing the following keys
                return_data = {
                    'userID': The userID of the user
                }
    """

    db = connection()
    cursor = db.cursor()

    userID = generate_new_userID()
    query = "INSERT INTO user(userID, email, pwd, nickname) VALUES (%s, %s, %s, %s)"
    data = (userID, db_data['email'], db_data['password'], db_data['name'])

    cursor.execute(query, data)
    db.commit()
    print(cursor.rowcount, "user data inserted.")

    return {"userID": userID}

def auth_get_pwd_by_email(email):
    """ Returns the password of the user with the given email.
        Args:
            email: A string of the email of the user
                email = "example@eg.com"
        Returns:
            None: If the user does not exist

            A string of the password of the user
                pwd = "password"
    """

    db = connection()
    cursor = db.cursor()
    query = "SELECT pwd FROM user WHERE email = '%s'" % (email)
    cursor.execute(query)
    result = cursor.fetchone()
    if result is None:
        print("User does not exist.")
        return None
    else:
        return result[0]

def auth_get_user_info_by_email(email):
    """ Returns the user information of the user as a dict with the given email.
        Args:
            email: A string of the email of the user
                email = email = "example@eg.com"
        Returns:
            None: If the user does not exist

            A dictionary containing the following keys
                return_data = {
                    'password': The password of the user
                    'name': The name of the user
                    'userID': The userID of the user
                }
    """

    db = connection()
    cursor = db.cursor()
    query = "SELECT * FROM user WHERE email = '%s'" % (email)
    cursor.execute(query)
    result = cursor.fetchone()
    if result is None:
        print("User does not exist.")
        return None
    else:
        return {
            "password": result[2],
            "name": result[3],
            "userID": result[0]
        }

def auth_get_user_name_by_id(user_id):

    db = connection()
    cursor = db.cursor()
    query = "SELECT nickname FROM user WHERE userID = '%s'" % (user_id)
    cursor.execute(query)
    result = cursor.fetchone()

    return(result[0])

def auth_get_user_info_by_userid(user_id):

    db = connection()
    cursor = db.cursor()
    query = "SELECT nickname, email, creditPoint FROM user WHERE userID = '%s'" % (user_id)
    cursor.execute(query)
    result = cursor.fetchone()

    return(result)

def update_user_by_userID(userID, user_info):
    db = connection()
    cursor = db.cursor()
    query = "UPDATE user SET email = %s, pwd = %s, nickname = %s WHERE userID = %s"
    data = (user_info['email'], user_info['password'], user_info['name'], userID)

    cursor.execute(query, data)
    db.commit()
    print("userID:", userID, "updated.")
