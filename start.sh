#!/bin/sh
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

# frontend running
run_frontend(){
	cd "$parent_path"
	cd frontend/
	cd dont_be_late/
	npm install
	npm install serve
	npm run build
	npx serve build
}
# try to run a browser window
run_browser(){
	firefox --new-window http://localhost:3000/
}

#database running
run_database(){
	cd "$parent_path"
	cd backend/
	cd database/

	# we check if there already exists a user and database, so that we don't have to redo initialisation
	mysql -u root -e "SHOW DATABASES;" | grep "management"
	if [ $? -eq 0 ]; then
		mysql -u root -e "SELECT user FROM mysql.user;" | grep "3900-m12a-late"
		if [ $? -eq 0 ]; then
			echo "both user and database exist, skipping init"
			return
		fi
	fi
	
	# otherwise we attempt to drop any leftover users/databases and reinitialize
	mysql -u root -e "SOURCE drop_database.sql"
	mysql -u root -e "SOURCE drop_user.sql"
	mysql -u root -e "SOURCE init.sql"
	
}

#backend running
run_backend(){
	cd "$parent_path"
	cd backend/
	python3 app.py
}

run_frontend & run_backend & run_database & run_browser


