from flask import Blueprint, request, jsonify
from services.auth_services import auth_register, auth_login, auth_logout

auth_endpoint = Blueprint('auth', __name__)


@auth_endpoint.route('/auth/login', methods=['POST'])
def customer_login():
    """
    The login route is a POST method api which takes in
    user email and passed and return a token if the user is 
    in the database. 
        request:
            {
                email: string,
                password: string
            }
        
        response:
            {
                userID: int,
                userName: string,
                token: string,
                creditPoint: int
            }
    """

    user_info = request.get_json()

    get_info = {}

    try:
        get_info = auth_login(user_info)
    except Exception as e:
        return jsonify({"error": "Invalid Details"}), 400

    return jsonify(get_info)


@auth_endpoint.route('/auth/register', methods=['POST'])
def customer_signup():
    """
    This is a POST method register api which takes in user
    details and registers the detail in the database and returns
    a token for the user.
    """

    user_info = request.get_json()
    get_info = {}

    try:
        get_info = auth_register(user_info)
    except Exception as e:
        print(e)
        if str(e) == 'Invalid Input':
            return jsonify({"error": "Invalid Details"}), 400

    return jsonify(get_info)


@auth_endpoint.route('/auth/logout', methods=['POST'])
def customer_logout():
    """
    This is a POST method api, which takes in a user 
    token and logs out the user.    
    """

    token = request.headers.get("Authorization")
    get_resp = {}

    try:
        get_resp = auth_logout(token)
    except Exception as e:
        print(e)
        if str(e) == 'Invalid Token':
            return jsonify({"error": "Invalid Token"}), 403

    return get_resp
