
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

#CORS(app)  # Allow cross-origin requests for development purposes
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB

upload_folder = 'D:/webServer/Beamhash/apps/Uploads'
if not os.path.exists(upload_folder):
    os.makedirs(upload_folder)

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

if __name__ == '__main__':

    app.run(ssl_context=('D:/webServer/Beamhash/apps/cert/certificate.pem', 'D:/webServer/Beamhash/apps/cert/privatekey.pem'),host='0.0.0.0', port=5000)