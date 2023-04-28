import pymysql

def connection():
    return pymysql.connect(
        host="localhost",
        user="3900-m12a-late",
        password="password",
        database="management"
    )
