from database.auth import *
from database.event import *
from database.booking import *
from database.review import *
from database.recommendation import *
from database.follow import *
from database.tier import *
from database.payment import *

# Add Bookings.
create_booking_DB({'eventID': 201, 'userID': 130, 'quantity': 5,})
create_booking_DB({'eventID': 202, 'userID': 102, 'quantity': 2,})
create_booking_DB({'eventID': 202, 'userID': 105, 'quantity': 4,})
create_booking_DB({'eventID': 202, 'userID': 109, 'quantity': 1,})
create_booking_DB({'eventID': 202, 'userID': 111, 'quantity': 2,})
create_booking_DB({'eventID': 202, 'userID': 118, 'quantity': 1,})
create_booking_DB({'eventID': 202, 'userID': 121, 'quantity': 2,})
create_booking_DB({'eventID': 203, 'userID': 113, 'quantity': 21,})
create_booking_DB({'eventID': 203, 'userID': 121, 'quantity': 13,})
create_booking_DB({'eventID': 204, 'userID': 103, 'quantity': 1,})
create_booking_DB({'eventID': 204, 'userID': 104, 'quantity': 1,})
create_booking_DB({'eventID': 204, 'userID': 106, 'quantity': 11,})
create_booking_DB({'eventID': 204, 'userID': 106, 'quantity': 20,})
create_booking_DB({'eventID': 204, 'userID': 111, 'quantity': 1,})
create_booking_DB({'eventID': 204, 'userID': 112, 'quantity': 2,})
create_booking_DB({'eventID': 204, 'userID': 119, 'quantity': 3,})
create_booking_DB({'eventID': 204, 'userID': 122, 'quantity': 2,})
create_booking_DB({'eventID': 204, 'userID': 127, 'quantity': 1,})
create_booking_DB({'eventID': 205, 'userID': 103, 'quantity': 1,})
create_booking_DB({'eventID': 205, 'userID': 105, 'quantity': 2,})
create_booking_DB({'eventID': 205, 'userID': 107, 'quantity': 1,})
create_booking_DB({'eventID': 205, 'userID': 109, 'quantity': 2,})
create_booking_DB({'eventID': 205, 'userID': 111, 'quantity': 1,})
create_booking_DB({'eventID': 205, 'userID': 113, 'quantity': 2,})
create_booking_DB({'eventID': 206, 'userID': 116, 'quantity': 4,})
create_booking_DB({'eventID': 207, 'userID': 117, 'quantity': 200,})
create_booking_DB({'eventID': 207, 'userID': 118, 'quantity': 100,})
create_booking_DB({'eventID': 207, 'userID': 121, 'quantity': 50,})
create_booking_DB({'eventID': 208, 'userID': 101, 'quantity': 2,})
create_booking_DB({'eventID': 208, 'userID': 105, 'quantity': 2,})
create_booking_DB({'eventID': 209, 'userID': 123, 'quantity': 1,})
create_booking_DB({'eventID': 209, 'userID': 124, 'quantity': 2,})
create_booking_DB({'eventID': 209, 'userID': 123, 'quantity': 1,})
create_booking_DB({'eventID': 209, 'userID': 124, 'quantity': 2,})
create_booking_DB({'eventID': 209, 'userID': 125, 'quantity': 1,})
create_booking_DB({'eventID': 209, 'userID': 126, 'quantity': 2,})
create_booking_DB({'eventID': 210, 'userID': 107, 'quantity': 4,})
create_booking_DB({'eventID': 210, 'userID': 121, 'quantity': 3,})

# Add Follows.
create_follow_relation({'userID': 101}, {'userID': 102})
create_follow_relation({'userID': 101}, {'userID': 103})
create_follow_relation({'userID': 101}, {'userID': 106})
create_follow_relation({'userID': 101}, {'userID': 107})
create_follow_relation({'userID': 101}, {'userID': 108})
create_follow_relation({'userID': 101}, {'userID': 115})
create_follow_relation({'userID': 101}, {'userID': 117})
create_follow_relation({'userID': 101}, {'userID': 119})
create_follow_relation({'userID': 101}, {'userID': 122})
create_follow_relation({'userID': 101}, {'userID': 125})
create_follow_relation({'userID': 101}, {'userID': 129})
create_follow_relation({'userID': 102}, {'userID': 101})
create_follow_relation({'userID': 102}, {'userID': 106})
create_follow_relation({'userID': 102}, {'userID': 110})
create_follow_relation({'userID': 102}, {'userID': 115})
create_follow_relation({'userID': 103}, {'userID': 101})
create_follow_relation({'userID': 103}, {'userID': 111})
create_follow_relation({'userID': 103}, {'userID': 121})
create_follow_relation({'userID': 106}, {'userID': 104})
create_follow_relation({'userID': 107}, {'userID': 112})
create_follow_relation({'userID': 107}, {'userID': 118})
create_follow_relation({'userID': 107}, {'userID': 121})
create_follow_relation({'userID': 107}, {'userID': 129})
create_follow_relation({'userID': 108}, {'userID': 101})
create_follow_relation({'userID': 108}, {'userID': 103})
create_follow_relation({'userID': 108}, {'userID': 125})
create_follow_relation({'userID': 109}, {'userID': 101})
create_follow_relation({'userID': 111}, {'userID': 104})
create_follow_relation({'userID': 111}, {'userID': 109})
create_follow_relation({'userID': 111}, {'userID': 117})
create_follow_relation({'userID': 111}, {'userID': 130})
create_follow_relation({'userID': 114}, {'userID': 104})
create_follow_relation({'userID': 114}, {'userID': 105})
create_follow_relation({'userID': 114}, {'userID': 109})
create_follow_relation({'userID': 114}, {'userID': 115})
create_follow_relation({'userID': 118}, {'userID': 101})
create_follow_relation({'userID': 118}, {'userID': 109})
create_follow_relation({'userID': 118}, {'userID': 124})
create_follow_relation({'userID': 122}, {'userID': 101})
create_follow_relation({'userID': 122}, {'userID': 121})
create_follow_relation({'userID': 123}, {'userID': 101})
create_follow_relation({'userID': 125}, {'userID': 102})
create_follow_relation({'userID': 125}, {'userID': 118})
create_follow_relation({'userID': 125}, {'userID': 119})
create_follow_relation({'userID': 125}, {'userID': 122})
create_follow_relation({'userID': 128}, {'userID': 101})
create_follow_relation({'userID': 128}, {'userID': 102})
create_follow_relation({'userID': 128}, {'userID': 104})
create_follow_relation({'userID': 128}, {'userID': 107})
create_follow_relation({'userID': 128}, {'userID': 111})
create_follow_relation({'userID': 128}, {'userID': 117})
create_follow_relation({'userID': 128}, {'userID': 122})
create_follow_relation({'userID': 128}, {'userID': 126})
