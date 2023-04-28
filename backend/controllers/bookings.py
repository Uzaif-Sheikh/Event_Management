from flask import jsonify, request, Blueprint
from services.booking_services import booking_create, booking_delete, booking_get_by_userid

booking_endpoint = Blueprint('booking', __name__)


# done, except token and auth
@booking_endpoint.route('/booking/new/<eventid>', methods=['POST'])
def create_booking(eventid):
    """
    A POST method route which takes in ticket details and books
    the ticket to an event and returns bookingId. 
    """

    body = request.get_json()
    token = request.headers.get('Authorization')

    booking_info = {
        'eventID': int(eventid),
        'userID': body['userID'],
        'quantity': body['quantity'],
    }

    bank_info = {
        'cardName': body['cardName'],
        'cardNumber': body['cardNumber'],
        'expiryDate': body['expirationDate'],
        'cvv': body['securityCode'],
        'userID': body['userID']
    }

    resp = {}

    try:
        resp = booking_create(booking_info, bank_info, token)
        return (resp)
    except Exception as e:
        if (str(e) == "Invalid Token"):
            return jsonify({"error": str(e)}), 403
        else:
            return jsonify({"error": "Invalid Input 2"}), 400


@booking_endpoint.route('/booking/del/<bookingid>', methods=['DELETE'])
def delete_booking(bookingid):
    """
    This routes deletes the booking by taking in a 
    bookingID.
    """

    token = request.headers.get('Authorization')
    body = {
        "bookingID": bookingid
    }

    try:
        booking_delete(body, token)
    except Exception as e:
        if (str(e) == "Invalid Token"):
            return jsonify({"error": str(e)}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400

    return jsonify({})


@booking_endpoint.route('/booking/getall/<userid>', methods=['GET'])
def getall_booking_userid(userid):
    """
    This routes gets all the booking by a user.
    """

    body = {
        "userID": userid
    }

    resp = {}

    try:
        resp = booking_get_by_userid(body)
    except Exception as e:
        if (str(e) == "Invalid Token"):
            return jsonify({"error": str(e)}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400

    return jsonify(resp)
