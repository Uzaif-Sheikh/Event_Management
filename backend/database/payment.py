from database.connector import connection

def generate_new_cardID():
    db = connection()
    cursor = db.cursor()
    query = "SELECT MAX(cardID) FROM card"
    cursor.execute(query)
    current_max = cursor.fetchone()[0]
    if current_max is None:
        return 1
    else:
        return current_max + 1

################################################################################

def add_card_DB(card_info):
    """ Save a new card for user into the database.
        Args:
            card_info: A dictionary containing the following keys
                card_info = {
                    'userID': The userID of the user who created the card
                    'cardNumber': The card number of the card
                    'cardName': The name of the card
                    'expiryDate': The expiry date of the card
                    'cvv': The cvv of the card
                }
        Returns:
            A dictionary containing the following keys
                card_info = {
                    'cardID': The cardID of the card
                }
    """
    db = connection()
    cursor = db.cursor()

    cardID = generate_new_cardID()
    query = "INSERT INTO card(cardID, userID, cardNumber, cardName, expiryDate, cvv) VALUES (%s, %s, %s, %s, %s, %s)"
    data = (cardID, card_info['userID'], card_info['cardNumber'], card_info['cardName'], card_info['expiryDate'], card_info['cvv'])

    cursor.execute(query, data)
    db.commit()
    print("The card", cardID, "for user", card_info['userID'], "saved.")

    return {"cardID": cardID}

def update_card_DB(card_info):
    """ Update a card for user into the database.
        Args:
            card_info: A dictionary containing the following keys
                card_info = {
                    'cardID': The cardID of the card
                    'cardNumber': The card number of the card
                    'cardName': The name of the card
                    'expiryDate': The expiry date of the card
                    'cvv': The cvv of the card
                }
        Returns:
            A dictionary containing the following keys
                card_info = {
                    'cardID': The cardID of the card
                }
    """
    db = connection()
    cursor = db.cursor()

    query = "UPDATE card SET cardNumber = %s, cardName = %s, expiryDate = %s, cvv = %s WHERE cardID = %s"
    data = (card_info['cardNumber'], card_info['cardName'], card_info['expiryDate'], card_info['cvv'], card_info['cardID'])

    cursor.execute(query, data)
    db.commit()
    print("The card", card_info['cardID'], "updated.")

    return {"cardID": card_info['cardID']}

def get_card_DB(userID):
    """ Get all cards for a user from the database.
        Args:
            userID: The userID of the user
        Returns:
            A dictionary containing the following keys
                card_info = {
                    'cardID': The cardID of the card
                    'cardNumber': The card number of the card
                    'cardName': The name of the card
                    'expiryDate': The expiry date of the card
                    'cvv': The cvv of the card
                }
    """
    db = connection()
    cursor = db.cursor()

    query = "SELECT * FROM card WHERE userID = '%s'" % (userID)
    cursor.execute(query)
    return cursor.fetchall()

def get_latest_added_card_by_userID(userID):
    """ Get the latest added card of a user from the database.
        Args:
            userID: The userID of the user
        Returns:
            A dictionary containing the following keys
                card_info = {
                    'cardID': The cardID of the card
                    'cardNumber': The card number of the card
                    'cardName': The name of the card
                    'expiryDate': The expiry date of the card
                    'cvv': The cvv of the card
                }
    """
    db = connection()
    cursor = db.cursor()

    query = "SELECT * FROM card WHERE userID = '%s' ORDER BY cardID DESC LIMIT 1" % (userID)
    cursor.execute(query)
    return cursor.fetchone()
