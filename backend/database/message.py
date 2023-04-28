from database.connector import connection

def get_all_message_DB(body):
    """ returns all the messages that are addressed to a user
        Args:
            userID: A unique integer associated with a user entry
                userID = 123
        Returns:
            None: If the user does not exist

            A list of entries with messages
    """
    db = connection()
    cursor = db.cursor()
    query = "SELECT * FROM messages WHERE userID = %s" % (body['userID'])
    cursor.execute(query)
    return cursor.fetchall()
