from flask import Flask, request, jsonify
from flask_cors import CORS
from controllers.auth import auth_endpoint
from controllers.events import event_endpoint
from controllers.bookings import booking_endpoint
from controllers.reviews import review_endpoint
from controllers.friends import friend_endpoint
from controllers.messages import messages_endpoint

from services.event_services import *
from services.booking_services import booking_create

app = Flask(__name__)
CORS(app)
app.register_blueprint(auth_endpoint)
app.register_blueprint(event_endpoint)
app.register_blueprint(booking_endpoint)
app.register_blueprint(review_endpoint)
app.register_blueprint(friend_endpoint)
app.register_blueprint(messages_endpoint)


@app.route('/')
def test():
    print("hello ===")
    return {"res": "Don't be Late ==> EventSystem"}


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
