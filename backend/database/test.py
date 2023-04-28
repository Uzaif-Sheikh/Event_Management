from database.auth import *
from database.event import *
from database.booking import *
from database.review import *
from database.recommendation import *
from database.follow import *
from database.tier import *
from database.payment import *

db_user_create = {
    'email': '123@gmail.com',
    'name': 'xiaodongzhao',
    'password': '931145d4ddd1811be545e4ac88a81f1fdbfaf0779c437efba16b884595274d11'
}

db_event_create = {
    "title": "Capybara 🦦",
    "organiserName": "Fiona",
    "organiserId": 1000,
    "eventType": "Food",
    "location": "UNSW",
    "startTimeandDate": "2042-02-09 02:30:00",
    "endTimeandDate": "2042-02-10 12:30:00",
    "banner": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
    "description": "Learn how to train capybara, cause Capy >> llama.",
    "totalTicketQuantity": 4,
    "ticketPrice": 20,
}

db_booking_create = {
    'eventID': 31,
    'userID': 1,
    'quantity': 2,
}

db_booking_delete = {
    'bookingID': 2,
}

db_create_review = {
    'eventID': 32,
    'userID': 1,
    'comment': 'This is a comment',
    'rate': 5,
}

db_create_reply = {
    'reviewID': 32,
    'userID': 1,
    'comment': 'This is a reply',
}

# auth_register_intoDB(db_user_create)
# event_create_intoDB(db_event_create)
# create_booking_DB(db_booking_create)
# delete_booking_DB(db_booking_delete)
# create_review_DB(db_create_review)
# reply_review_DB(db_create_reply)

# print(get_all_attended_eventID_by_userID(3))
# print(get_most_frequent_eventType_by_userID(3))
# print(get_recommendation_by_userID(3))

# print(get_all_attending_users(36))
# print(get_following_attending_users({'userID': 1, 'eventID': 36}))

# print(check_if_event_exists(372))

db_delete_event = {
    "eventID": 372,
}

# delete_event_by_eventId(db_delete_event)

user1 = {
    "userID": 1,
}
user2 = {
    "userID": 4,
}

# create_follow_relation(user1, user2)
# print(get_followings(1))

# print(get_all_booking_and_ticket_price_by_userID(3))
# print(get_all_booking_DB({'userID': 3}))
# print(count_total_price_by_userID(3))

card_info = {
    'userID': 1,
    'cardNumber': "1234 1234 1234 1234",
    'cardName': "Hao Ren",
    'expiryDate': "05/23",
    'cvv': "123"
}

# add_card_DB(card_info)

# print(count_total_price_by_userID(3))
# print(get_name_creditPoint_by_userID(104))

# create_booking_DB({'eventID': 202, 'userID': 102, 'quantity': 2,})
# print(get_first_card_of_user_by_userID(1))

# create_review_DB({'eventID': 205, 'userID': 102, 'comment': 'This is a comment', 'rate': 5,})
#create_review_DB({'eventID': 205, 'userID': 104, 'comment': 'This is a comment', 'rate': 5,})
# create_review_DB({'eventID': 205, 'userID': 106, 'comment': 'This is a comment', 'rate': 5,})

# reply_review_DB({'reviewID': 7, 'userID': 102, 'comment': 'This is a reply',})
delete_event_by_eventId(205)