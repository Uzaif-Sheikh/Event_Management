from database.connector import connection

def generate_new_followID():
    db = connection()
    cursor = db.cursor()
    query = "SELECT MAX(followID) FROM follow"
    cursor.execute(query)
    current_max = cursor.fetchone()[0]
    if current_max is None:
        return 1
    else:
        return current_max + 1

def check_if_follow_relationship_exists(sender, receiver):
    """ Check if the follow relationship between sender and receiver exists.
        Args:
            Two dictionaries containing the following keys
                sender = {
                    'userID': The userID of the user
                }
                receiver = {
                    'userID': The userID of the user
                }
        Returns:
            A boolean value indicating if the follow relationship exists
    """
    db = connection()
    cursor = db.cursor()
    query = "SELECT * FROM follow WHERE fromID = %s AND toID = %s" % (sender['userID'], receiver['userID'])
    cursor.execute(query)
    return cursor.fetchone() is not None

################################################################################

def create_follow_relation(sender, receiver):
    """ Send a friend request from sender to receiver.
        Args:
            Two dictionaries containing the following keys
                sender = {
                    'userID': The userID of the user
                }
                receiver = {
                    'userID': The userID of the user
                }
    """

    db = connection()
    cursor = db.cursor()

    if sender['userID'] == receiver['userID']:
        return None

    followID = generate_new_followID()
    query = "INSERT INTO follow(followID, fromID, toID) VALUES (%s, %s, %s)"
    data = (followID, sender['userID'], receiver['userID'])

    cursor.execute(query, data)
    db.commit()
    print("User", sender['userID'], "follows user", receiver['userID'], "successfully.")

    return {"fromID": sender['userID'], "toID": receiver['userID']}


def delete_follow_relation(sender, receiver):
    """ Delete the follow relation between sender and receiver.
        Args:
            Two dictionaries containing the following keys
                sender = {
                    'userID': The userID of the user
                }
                receiver = {
                    'userID': The userID of the user
                }
    """

    db = connection()
    cursor = db.cursor()

    if check_if_follow_relationship_exists(sender, receiver) is False:
        return None

    deleteQuery = "DELETE FROM follow WHERE fromID = %s AND toID = %s"
    data = (sender['userID'], receiver['userID'])

    cursor.execute(deleteQuery, data)
    db.commit()
    print("User", sender['userID'], "unfollows user", receiver['userID'], "successfully.")

    return {}

def check_following_relation(sender, receiver):
    """ checking if the the sender is following the receiver
        Args:
            Two dictionaries containing the following keys
                sender = {
                    'userID': The userID of the user
                }
                receiver = {
                    'userID': The userID of the user
                }
    """

    db = connection()
    cursor = db.cursor()

    if check_if_follow_relationship_exists(sender, receiver) is False:
        return {"isFollowed": False}

    getQuery = "SELECT * FROM follow WHERE fromID = %s AND toID = %s" % (sender['userID'], receiver['userID'])
    cursor.execute(getQuery)
    result = cursor.fetchone()

    if len(result) == 0:
        return {"isFollowed": False}
    else:
        return {"isFollowed": True}


def get_followings(userID):
    """ Get the list of followings of a user.
        Args:
            userID: The userID of the user
        Returns:
            A list of dictionaries containing the following keys
                return_data = {
                    'userID': The userID of the user
                    'name': The nickname of the user
                }
    """
    db = connection()
    cursor = db.cursor()
    query = "SELECT toID FROM follow WHERE fromID = %s" % (userID)
    cursor.execute(query)
    return_data = []

    
    for row in cursor.fetchall():
        query = "SELECT nickname FROM user WHERE userID = %s" % (row[0])
        cursor.execute(query)
        #print(str(cursor.fetchone()))
        return_data.append({"userID": row[0], "name": cursor.fetchone()[0]})
    return return_data

def get_followers(userID):
    """ Get the list of followers of a user.
        Args:
            userID: The userID of the user
        Returns:
            A list of dictionaries containing the following keys
                return_data = {
                    'userID': The userID of the user
                }
    """
    db = connection()
    cursor = db.cursor()
    query = "SELECT fromID FROM follow WHERE toID = %s" % (userID)
    cursor.execute(query)
    return_data = []
    for row in cursor.fetchall():
        return_data.append({"userID": row[0]})
    return return_data