-- Active: 1667119644338@@localhost@3306@management
CREATE TABLE user (
    userID int PRIMARY KEY,
    email varchar(255) NOT NULL UNIQUE,
    pwd varchar(255) NOT NULL,
    nickname varchar(32),
    creditPoint int DEFAULT 0
);

CREATE TABLE event (
    eventID int PRIMARY KEY,
    eventName varchar(255) NOT NULL,
    hostID int NOT NULL,
    hostName varchar(255) NOT NULL,
    eventType varchar(255) NOT NULL,
    price decimal(10, 2) NOT NULL,
    capacity int NOT NULL,
    available int NOT NULL,
    description text,
    location varchar(255),
    startTime datetime NOT NULL,
    endTime datetime NOT NULL,
    banner text,
    vipPrice decimal(10, 2)
);

CREATE TABLE review (
    reviewID int PRIMARY KEY,
    eventID int NOT NULL,
    userID int NOT NULL,
    rating int NOT NULL,
    reviewTime dateTime NOT NULL,
    comment text NOT NULL
);

CREATE TABLE reply (
    replyID int PRIMARY KEY,
    reviewID int NOT NULL,
    userID int NOT NULL,
    replyTime dateTime NOT NULL,
    comment text NOT NULL
);

CREATE TABLE follow (
    followID int PRIMARY KEY,
    fromID int NOT NULL,
    toID int NOT NULL
);

CREATE TABLE booking (
    bookingID int PRIMARY KEY,
    userID int NOT NULL,
    eventID int NOT NULL,
    quantity int NOT NULL
);

CREATE TABLE messages (
    userID int NOT NULL,
    eventID int NOT NULL,
    string varchar(9999) NOT NULL
);


CREATE TABLE card (
    cardID int PRIMARY KEY,
    userID int NOT NULL,
    cardNumber varchar(255) NOT NULL,
    cardName varchar(255) NOT NULL,
    expiryDate varchar(255) NOT NULL,
    cvv varchar(255) NOT NULL
);
