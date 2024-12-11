@echo off
set FLASK_APP=flask_server_data_from_app.py
call C:\Users\Arun\anaconda3\Scripts\activate.bat flask_env
start /b waitress-serve --listen=127.0.0.1:5000 flask_server_data_from_app:app