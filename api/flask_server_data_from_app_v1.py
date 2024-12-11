
from flask import Flask, request, jsonify, Response, send_file
from flask_cors import CORS
import os
import queue
import logging

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

#CORS(app)  # Allow cross-origin requests for development purposes
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB

upload_folder = 'D:/webServer/Beamhash/api/upload'
if not os.path.exists(upload_folder):
    os.makedirs(upload_folder)
results_folder ='D:/webServer/Beamhash/api/Results'

clients = []

#Picking up audio file from web apps
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)
    return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 200 
'''
@app.route('/get-file', methods=['GET'])
def get_file():
    app.logger.debug('Entered get_file route')
    return 'get_file route is working!'

'''
@app.route('/get-file', methods=['GET'])
def get_file():
    app.logger.debug('Entered get_file route')
    try:
        files = os.listdir(results_folder)
        app.logger.debug(f'Files in results_folder: {files}')

        if not files:
            app.logger.debug('No files found in results_folder')
            return jsonify({'message': 'No files found'}), 404

        latest_file = max(
            [os.path.join(results_folder, f) for f in files],
            key=os.path.getctime
        )
        app.logger.debug(f'Latest file: {latest_file}')

        return send_file(latest_file, as_attachment=True)
    except Exception as e:
        app.logger.error(f'Error in get_file route: {e}')
        return jsonify({'message': 'Internal server error'}), 500
    
    '''
    files = os.listdir(results_folder)
    if not files:
        return jsonify({'message': 'No files found'+results_folder}), 404
    latest_file = max([os.path.join(results_folder, f) for f in files], key=os.path.getctime)
    with open(latest_file, 'r') as file:
        content = file.read()
    return jsonify({'content': content})
    '''
#--------------------------------------------------------------------------------------------------------
#Picking up transcript file from Result_Watcher it can be displayed on web app useing events
#@app.route('/process-file', methods=['POST'])
#def process_file():
#    data = request.get_json()
#    file_content = data['content']
    # Here you can process the file content or store it if needed
#    return jsonify({'message': 'File content received', 'content': file_content}),200

#@app.route('/events') 
#def events(): 
#        def generate(): 
#            q = queue.Queue() 
#            clients.append(q) 
#            try: 
#                while True: result = q.get() 
#                yield f"data: {result}\n\n" 
#            except GeneratorExit: clients.remove(q) 
#        return Response(generate(), mimetype="text/event-stream")
#------Enable the above code for using event based file data sharing to web app--------------------------

if __name__ == '__main__':

    app.run(ssl_context=('D:/webServer/Beamhash/api/cert/certificate.pem', 'D:/webServer/Beamhash/api/cert/privatekey.pem'),host='0.0.0.0', port=5000)
##    print("Registered Routes:")
 ##   for rule in app.url_map.iter_rules():
 ##       print(f"{rule.endpoint}: {rule}")
 ##   app.run(debug=True)
