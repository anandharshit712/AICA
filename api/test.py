#from flask import Flask, request, jsonify, Response
#from flask_cors import CORS
import os
import queue

results_folder ='D:/webServer/Beamhash/api/Results'
files = os.listdir(results_folder)
print("results_folder :"+results_folder)
if not files:
    print("no files")
else:
    latest_file = max([os.path.join(results_folder, f) for f in files], key=os.path.getctime)
    with open(latest_file, 'r') as file:
        content = file.read()
        print(file.name)
    print("files found")
    #print(content)