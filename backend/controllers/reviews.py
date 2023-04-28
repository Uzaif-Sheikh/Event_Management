from flask import jsonify, request, Blueprint
from services.review_services import *

review_endpoint = Blueprint('review', __name__)


@review_endpoint.route('/review/new/<eventid>', methods=['POST'])
def create_review(eventid):
    """
    This route allows a user to leave review on a event specified by the eventid  
    """

    body = request.get_json()
    token = request.headers.get('Authorization')

    review_info = {
        "eventID": eventid,
        "userID": body["userID"],
        "comment": body["comment"],
        "rate": body["rate"]
    }

    resp = {}

    try:
        resp = create_review_service(review_info, token)
    except Exception as e:
        if (str(e) == "Invalid Token"):
            return jsonify({"error": str(e)}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400

    return jsonify(resp)


@review_endpoint.route('/review/reply/<reviewid>', methods=['POST'])
def review_reply(reviewid):
    """
    This route lets a host to reply to the review on the 
    event, with the review specified by the reviewid 
    """

    body = request.get_json()
    token = request.headers.get('Authorization')

    body = {
        'reply': body['reply'],
        'reviewID': int(reviewid)
    }
    print(body)
    resp = {}

    try:
        resp = create_review_reply(body, token)
        print(resp)
    except Exception as e:
        if (str(e) == "Invalid Token"):
            return jsonify({"error": str(e)}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400

    return jsonify(resp)
