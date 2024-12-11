//login logic
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (response.ok) {
        alert('Login successful!');
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('audioPage').classList.remove('hidden');
    } else {
        alert(result.message);
    }
});

fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
})
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));

// WAV Conversion Functions
function convertToWav(blob, callback) {
    const reader = new FileReader();
    reader.onload = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(reader.result, (buffer) => {
            const wavBlob = encodeWav(buffer);
            callback(wavBlob);
        });
    };
    reader.readAsArrayBuffer(blob);
}

function encodeWav(buffer) {
    const channels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const samples = buffer.getChannelData(0);
    const wavData = encodeWavData(samples, sampleRate, channels);
    return new Blob([wavData], { type: 'audio/wav' });
}

function encodeWavData(samples, sampleRate, channels) {
    const blockAlign = channels * 2;
    const byteRate = sampleRate * blockAlign;
    const bufferLength = samples.length * 2 + 44;
    const buffer = new ArrayBuffer(bufferLength);
    const view = new DataView(buffer);

    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // Audio format (PCM)
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // Bits per sample

    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return buffer;
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

//  Audio Recording & Upload Logic
let audioChunks = [];
let mediaRecorder;
let audioFile = null;
let wavBlob = null; // To store the converted WAV blob

const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const audioPlayer = document.getElementById('audioPlayer');
const audioSource = document.getElementById('audioSource');
const uploadBtn = document.getElementById('uploadAudio');

// Start recording
startRecordingBtn.addEventListener('click', async function() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.ondataavailable = function(event) {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = function() {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioURL = URL.createObjectURL(audioBlob);
            audioSource.src = audioURL;
            audioPlayer.load();
            audioChunks = []; // Reset chunks
            audioFile = audioBlob; // Set the recorded audio file

            // Convert to WAV
            convertToWav(audioBlob, (convertedBlob) => {
                wavBlob = convertedBlob;
                // Optionally, update the audio player to play the WAV file
                const wavURL = URL.createObjectURL(wavBlob);
                audioSource.src = wavURL;
                audioPlayer.load();
            });
        };

        startRecordingBtn.classList.add('hidden');
        stopRecordingBtn.classList.remove('hidden');
    } catch (err) {
        console.error("Microphone access denied: ", err);
        alert("Please enable microphone access to record audio.");
    }
});

// Stop recording
stopRecordingBtn.addEventListener('click', function() {
    mediaRecorder.stop();
    stopRecordingBtn.classList.add('hidden');
    startRecordingBtn.classList.remove('hidden');
});

// Upload Audio
uploadBtn.addEventListener('click', async function() {
    if (!wavBlob) {
        alert("No audio file available to upload");
        return;
    }

    
    const uniqueFilename = `recording_${Date.now()}.wav`;  // Ensure extension matches Blob type
    const formData = new FormData();
    formData.append('file', wavBlob, uniqueFilename);

    try {
        const response = await fetch('https://api.beamhash.com/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        const result = await response.json();
        console.log('Upload success:', result);

        // Start polling for file content
        pollForFile(); // Await the polling process 
    } catch (error) {
        console.error('Error uploading file:', error);
    }
});

// Audio Upload from File Input
document.getElementById('audioUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) {
        alert('Please upload a valid audio file.');
        return;
    }

    // Convert .webm file to .wav
    convertToWav(file, (convertedBlob) => {
        wavBlob = convertedBlob;

        // Optionally update the audio player
        const wavURL = URL.createObjectURL(wavBlob);
        audioSource.src = wavURL;
        audioPlayer.load();

        alert('File successfully converted to WAV format.');
    });

    const audioURL = URL.createObjectURL(file);
    audioSource.src = audioURL;
    audioPlayer.load();
    wavBlob = file; // Set the uploaded file as audioFile for further actions
});

// Poll for file content
async function pollForFile() {
    let polling = true;
    const intervalId = setInterval(async () => {
        if (!polling) return;
        try {
            const response = await fetch('https://api.beamhash.com/get-file', {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });

            if (response.ok) {
                const data = await response.text(); // Get the content of the text file
                document.getElementById('audioSummary').value = data; // Display the content in the summary area
                polling = false; // // Stop polling once the file is found and displayed
                clearInterval(intervalId); // Stop the polling interval
            } else {
                console.error('Failed to fetch file:', response.status);
            }
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    }, 5000); // Poll every 5 seconds
}


//  Chat Logic
const chatHistory = document.getElementById('chatHistory');
const chatMessage = document.getElementById('chatMessage');
const sendMessageBtn = document.getElementById('sendMessage');

function addMessageToChat(message, sender) {
    const chatBubble = document.createElement('div');
    chatBubble.classList.add('chat-bubble');

    if (sender === 'user') {
        chatBubble.classList.add('user-message');
        chatBubble.textContent = `User: ${message}`;
    } else if (sender === 'system') {
        chatBubble.classList.add('system-message');
        chatBubble.textContent = `System: ${message}`;
    }

    chatHistory.appendChild(chatBubble);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to the bottom
}

sendMessageBtn.addEventListener('click', function() {
    const message = chatMessage.value.trim();
    if (message) {
        addMessageToChat(message, 'user');
        chatMessage.value = '';

        setTimeout(function() {
            const systemResponse = "Hello! How can I help you?";
            addMessageToChat(systemResponse, 'system');
        }, 500); // Add slight delay for system response
    }
});






//----------------------------------------------------------------------------------
//  Load File Content from Event Stream and Display in Summary Area
//const audioSummary = document.getElementById('audioSummary');

//const eventSource = new EventSource('https://api.beamhash.com/events');

//eventSource.onmessage = function(event) {
//    const data = JSON.parse(event.data);
//    audioSummary.value = data.content; // Display content in the summary area
//};

// Close event source when the page is unloaded
//window.addEventListener('beforeunload', function() {
//    eventSource.close();
//})}
