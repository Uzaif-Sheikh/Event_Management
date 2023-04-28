from database.connector import connection

def get_most_frequent_eventType_by_userID(userID):
    """ From booking table, get all eventIDs that the user has booked. Then, from event table, get the corresponding eventTypes. Return the most frequent eventType for the user.
        Args:
            userID: integer, the userID of the user
        Returns:
            eventType: string, the most frequent eventType for the user
    """

    db = connection()
    cursor = db.cursor()
    query = "SELECT event.eventType FROM event INNER JOIN booking ON event.eventID = booking.eventID WHERE booking.userID = %s GROUP BY event.eventType ORDER BY COUNT(*) DESC LIMIT 1" % (userID)
    cursor.execute(query)
    return cursor.fetchone()[0]

def get_all_attended_eventID_by_userID(userID):
    """ From other function, it use the userID to get all the eventIDs that the user has attended. Then, it will return a tuple of all the eventIDs.
        Args:
            userID: integer, the userID of the user
        Returns:
            attended_eventID: tuple, a tuple of all the eventIDs that the user has attended
    """

    db = connection()
    cursor = db.cursor()
    query = "SELECT eventID FROM booking WHERE userID = %s" % (userID)
    cursor.execute(query)
    ID_list = [item[0] for item in cursor.fetchall()]
    return tuple(ID_list)


################################################################################

def get_recommendation_by_userID(userID):
    """ Get the recommendation for the user based on the most frequent eventType and the attended eventIDs. It would not return the eventIDs that the user has attended.
        Args:
            userID: integer, the userID of the user
        Returns:
            All events data that match the recommendation.
    """
    eventType = get_most_frequent_eventType_by_userID(userID)
    attended_eventID = get_all_attended_eventID_by_userID(userID)

    db = connection()
    cursor = db.cursor()
    query = "SELECT * FROM event WHERE (eventType = '%s' AND eventID NOT IN %s)" % (eventType, attended_eventID)
    cursor.execute(query)
    recommendations =  cursor.fetchall()

    return recommendations
