-- Active: 1667119644338@@localhost@3306
CREATE USER '3900-m12a-late'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO '3900-m12a-late'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
CREATE DATABASE management;
USE management;
SOURCE schema.sql;
SOURCE test_data/fake_user.sql;
SOURCE test_data/fake_event.sql;
