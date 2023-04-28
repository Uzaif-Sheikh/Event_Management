# MySQL Database

## How to Install?

- MySQL Community Downloads: <https://dev.mysql.com/downloads/mysql/>
- MySQL Reference Manual: <https://dev.mysql.com/doc/refman/8.0/en/>

Please refer to Chapter 2.1 for the installation guide. For Windows users, there might be some extra work for you to initialize the MySQL database.

Please also refer to [this page](https://dev.mysql.com/doc/connector-python/en/connector-python-installation-binary.html) to ensure you install the Python connector properly.

## Then ...

After installing the MySQL database, please make sure you start the server. For macOS users, please go to `System Preference -> MySQL -> Start Server`, then test on your own terminal app. For Windows users, please refer to the official manual.

Then, open your terminal and type `mysql -u root -p` and input your password (set when installed) to start MySQL shell. You could type SQL query there, but make sure the statement end with ";".

Windows users should use this command instead (replace with your path):

`"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld"`

## Quick Initialization

*Make sure you change the direction to correct folder by `cd Documents/capstone-project-3900-m12a-late/backend/database` or your own path!*

**After running `mysql -u root -p` and entering the password which you created when installing, you should enter a SQL subshell now. Then use the following command: `SOURCE init.sql;`, all done!**

## If the above is not working...

Please open the `inti.sql` and copy commands to your shell, run it line by line. You can also visit the Git history for the previous version for initialization work.
