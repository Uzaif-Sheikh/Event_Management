#!/bin/sh

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

#frontend requirements
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
source ~/.bashrc
nvm install node
#------------------
# Do this stuff to run the frontend
#------------------
#cd "$parent_path"
#cd '/frontend'
#cd '/dont_be_late'

#database requirements
apt-get install mysql-server -y
#------------------
# Do this stuff to run the database
#------------------
#mysql -u root -p
#SOURCE reset.sql



#backend requirements
apt-get install python3 -y
apt-get install python3-pip -y
cd "$parent_path"
cd '/backend'
pip3 install -r requirements.txt
#------------------
# Do this stuff to run the backend
#------------------
#python3 app.py


