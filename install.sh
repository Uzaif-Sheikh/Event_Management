#!/bin/sh
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

apt update

#frontend requirements
apt-get install npm -y
npm cache clean -f
npm install -g npm@8.15.0
npm install -g n
n 16.17.1
npm install serve
sudo chown -R $USER:$USER '/home/lubuntu/.npm/'

#------------------
# Do this stuff to run the frontend
#------------------
#cd "$parent_path"
#cd '/frontend'
#cd '/dont_be_late'

#database requirements
apt-get install mysql-server -y
snap install mysql-shell
#------------------
# Do this stuff to run the database
#------------------
#mysql -u root -p
#SOURCE reset.sql



#backend requirements
apt-get install python3 -y
apt-get install python3-pip -y
cd "$parent_path"
cd backend/
pip3 install -r requirements.txt

#------------------
# Do this stuff to run the backend
#------------------
#python3 app.py


