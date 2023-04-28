from flask import Blueprint, request, jsonify
from services.friends_services import *

friend_endpoint = Blueprint('friend', __name__)


@friend_endpoint.route('/friend/user/<userid>', methods=['GET'])
def friend_user(userid):
    """
    This route gets the info about a particular 
    user using the userID. Upon returning, the 
    user data from the database is json-ified 
    and sent to the frontend
    """

    token = request.headers.get('Authorization')

    friend_info = {
        'userID': userid
    }

    try:
        resp = get_user_profile(friend_info, token)
    except Exception as e:
        if (str(e) == 'Invalid Token'):
            return jsonify({"error": "Invalid Token"}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400
    
    print(resp)

    return jsonify(resp)

@friend_endpoint.route('/friend/getallfollowed/<userid>', methods=['GET'])
def get_followed_users(userid):
    """
    This route gets the info about all the
    users a user is following, with the 
    userid field being the key. We get returned
    a list of users.
    """


    token = request.headers.get('Authorization')

    

    try:
        resp = get_followings(userid)
        
    except Exception as e:
        if (str(e) == 'Invalid Token'):
            return jsonify({"error": "Invalid Token"}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400
    
    return jsonify(resp)


@friend_endpoint.route('/friend/follow/<userid>',methods=['POST'])
def follow_friend(userid):
    """
    This route let a user follow other users in the event system.     
    """

    token = request.headers.get('Authorization')

    friend_info = {
        'reciverID': userid
    }

    try:
        resp = follow_services(friend_info, token)
    except Exception as e:
        if (str(e) == 'Invalid Token'):
            return jsonify({"error": "Invalid Token"}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400

    return jsonify(resp)


@friend_endpoint.route('/friend/unfollow/<userid>', methods=['POST'])
def follow_unfriend(userid):
    """
    This route let a user unfollow other users in the event system.     
    """

    token = request.headers.get('Authorization')

    friend_info = {
        'reciverID': userid
    }

    try:
        resp = unfollow_services(friend_info, token)
    except Exception as e:
        if (str(e) == 'Invalid Token'):
            return jsonify({"error": "Invalid Token"}), 403
        else:
            return jsonify({"error": "Invalid Input"}), 400

    return jsonify(resp)
