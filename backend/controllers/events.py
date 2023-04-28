from flask import jsonify, request, Blueprint
from services.event_services import *

event_endpoint = Blueprint('event', __name__)


@event_endpoint.route('/event/create', methods=['POST'])
def create_event():
    """
    This routes creates an event and returns 
    the eventID.
    """

    resp = request.get_json()
    token = request.headers.get('Authorization')

    try:
        eventid = event_create(resp, token)
        return jsonify(eventid)
    except Exception as e:
        if (str(e) == 'Invalid Token'):
            return jsonify({"error": "Invalid Token"}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400


@event_endpoint.route('/event/getall', methods=['GET'])
def get_all_events():
    """
    This route gets all the event in the database.
    """

    resp = event_getall()

    return jsonify(resp)


@event_endpoint.route('/event/<eventid>', methods=['GET'])
def get_event(eventid):
    """
    This routes gets the details of a event by the 
    eventID.
    """

    try:
        event = event_getbyid(eventid)
    except Exception as e:
        return jsonify({"error": "Invalid Input"}), 400

    return jsonify(event)


@event_endpoint.route('/event/<eventid>', methods=['PUT'])
def put_event(eventid):
    """
    This routes updates the detail for a particular event.
    """

    resp = request.get_json()
    token = request.headers.get('Authorization')

    try:
        event_edit_by_eventid(token, resp, eventid)
    except Exception as e:
        if (str(e) == 'Invalid Token'):
            return jsonify({"error": "Invalid Token"}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400

    return jsonify({})


@event_endpoint.route('/event/getall/<userid>', methods=['GET'])
def get_event_for_user(userid):
    """
    This route gets all the events created by a
    particular user.
    """

    resp = {}

    try:
        resp = event_getall_by_userid(userid)
    except Exception as e:
        if (str(e) == 'Invalid Token'):
            return jsonify({"error": "Invalid Token"}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400

    return jsonify(resp)


@event_endpoint.route('/event/getallAttendees/<eventid>', methods=['GET'])
def get_attendees_for_event(eventid):
    """
    This route gets all the user attending a event as specified by eventid. 
    """
    
    resp = {}
    token = request.headers.get('Authorization')
    try:
        resp = event_get_attendees_for_event(token, eventid)
    except Exception as e:
        if (str(e) == 'Invalid Token'):
            return jsonify({"error": "Invalid Token"}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400

    return jsonify(resp)


@event_endpoint.route('/event/cancel/<eventid>', methods=['DELETE'])
def cancel_event(eventid):
    """
    This routes cancels the event specified by the eventid. 
    """
    
    resp = {}
    token = request.headers.get('Authorization')
    try:
        resp = event_cancel_event(token, eventid)

    except Exception as e:
        if (str(e) == 'Invalid Token'):
            return jsonify({"error": "Invalid Token"}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400

    return jsonify(resp)


@event_endpoint.route('/event/recommendations/<userID>', methods=['GET'])
def get_recommendations(userID):
    """
    This routes is use to provides event recommendations to the 
    user specified by the userID
    """

    resp = {}
    token = request.headers.get('Authorization')
    try:
        resp = event_get_recommendations(userID)

    except Exception as e:
        if (str(e) == 'Invalid Token'):
            return jsonify({"error": "Invalid Token"}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400

    return jsonify(resp)
