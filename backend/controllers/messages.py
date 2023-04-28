from flask import jsonify, request, Blueprint
from services.message_services import *

messages_endpoint = Blueprint('message', __name__)

@messages_endpoint.route('/messages/getall/<userid>', methods=['GET'])
def getall_message_userid(userid):
    """
    This route gets all the messages specified by the userID given.
    """
    body = {
        "userID": userid
    }

    resp = {}

    try:
        resp = message_get_by_userid(body)
    except Exception as e:
        if (str(e) == "Invalid Token"):
            return jsonify({"error": str(e)}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400
    

    return jsonify(resp)