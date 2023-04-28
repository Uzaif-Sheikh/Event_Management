# Backend:

So the backend has been divided into three component,
```linux
~ ./project/backend
   |
   |-- ./controllers
   |
   |-- ./services
   |
   |-- ./database
   |
   |-- ./util
```

## Controller Layer

The controller layer will have all the routes to the RESTapi and all the routes (i.e auth, event, friends, booking) will be added to `backend/app.py` using flask blueprint.

## Service Layer

The service layer will have all the logic needed for the controller layer, so we can just export the functions/Class needed for the routes.

## Database Layer

In this layer we will initialize our database and make all the neccesary query needed for the database. 

## Util Layer

This Layer will have the token.py to create and manage JWT for the customer.

## How to start
```pip install -r requirements.txt```



If you have virtual environment for python3:
```
source envname/bin/activate
```

```python3 app.py```