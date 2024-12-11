import os
import logging
from flask import Flask, request, jsonify, Response, send_file
from flask_cors import CORS

# Create the Flask app and enable CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Set the maximum content length for uploads
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB

# Setup directories for uploads and results
upload_folder = 'D:/webServer/Beamhash/api/upload'
if not os.path.exists(upload_folder):
    os.makedirs(upload_folder)
results_folder = 'D:/webServer/Beamhash/api/Results'

# Create a log directory if it does not exist
log_directory = 'D:/webServer/Beamhash/api/log'
if not os.path.exists(log_directory):
    os.makedirs(log_directory)

# Configure logging to store logs in a file
log_file_path = os.path.join(log_directory, 'app.log')
logging.basicConfig(
    filename=log_file_path,
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
app.logger.addHandler(logging.StreamHandler())
app.logger.setLevel(logging.DEBUG)

# Route to handle file upload
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        app.logger.debug('No file part in the request')
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        app.logger.debug('No selected file in the request')
        return jsonify({'message': 'No selected file'}), 400
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)
    app.logger.info(f'File uploaded successfully: {file_path}')
    return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 200

# Route to get the latest file

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
        app.logger.info(f'Sending latest file: {latest_file}')
        
        with open(latest_file, 'r') as file:
            file_content = file.read()
        
        #return jsonify({'file_content': file_content})
        return file_content
    except FileNotFoundError:
        app.logger.error('Results folder not found')
        return jsonify({'message': 'Results folder not found'}), 404
    except Exception as e:
        app.logger.error(f'Error in get_file route: {e}')
        return jsonify({'message': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(
        ssl_context=(
            'D:/webServer/Beamhash/api/cert/certificate.pem',
            'D:/webServer/Beamhash/api/cert/privatekey.pem'
        ),
        host='0.0.0.0',
        port=5000
    )
