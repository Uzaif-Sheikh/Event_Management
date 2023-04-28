FROM python:3.8

WORKDIR /app

ENV FLASK_APP=app.py

COPY ./requirements.txt .

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000

ENTRYPOINT [ "python3" ]

 CMD [ "app.py" ]