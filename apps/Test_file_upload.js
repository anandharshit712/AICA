import React, { useState } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import axios from 'axios';

const App = () => {
  const [audioFile, setAudioFile] = useState(null);

  const handleUpload = async () => {
    if (!audioFile) {
      alert("No audio file available to upload");
      return;
    }

    const formData = new FormData();
    formData.append('file', audioFile, 'recording.webm');

    try {
      const response = await axios.post('https://192.168.4.30/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Upload success:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <ReactMediaRecorder
        audio
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            <p>{status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <audio src={mediaBlobUrl} controls />
            <button
              onClick={async () => {
                const response = await fetch(mediaBlobUrl);
                const blob = await response.blob();
                setAudioFile(blob);
              }}
            >
              Capture Audio
            </button>
            <button onClick={handleUpload}>Upload Audio</button>
          </div>
        )}
      />
      <input
        type="file"
        accept="audio/*"
        onChange={e => {
          setAudioFile(e.target.files[0]);
        }}
      />
    </div>
  );
};

export default App;
