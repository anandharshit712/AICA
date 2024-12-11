// Validate Login and Redirect
function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Hardcoded credentials
    if (username === 'user' && password === 'password') {
        window.location.href = 'audio.html';  // Redirect to audio.html
    } else {
        alert('Invalid credentials');  // Display an error message
    }
}


// Audio Recording
let mediaRecorder;
let audioChunks = [];

document.getElementById('startRecording').onclick = function () {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            audioChunks = [];

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg-3' });
                const audioUrl = URL.createObjectURL(audioBlob);

                // Create an audio element to play the recorded audio
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = audioUrl;

                // Display the audio element on the page
                const audioPlaybackDiv = document.getElementById('audioPlayback');
                audioPlaybackDiv.innerHTML = ''; // Clear previous audio elements
                audioPlaybackDiv.appendChild(audio);
            };

            document.getElementById('startRecording').disabled = true;
            document.getElementById('stopRecording').disabled = false;
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
        });
};

document.getElementById('stopRecording').onclick = function () {
    mediaRecorder.stop();
    document.getElementById('startRecording').disabled = false;
    document.getElementById('stopRecording').disabled = true;
};

// Chat Functionality
function sendMessage() {
    const chatInput = document.getElementById('chatInput').value;
    const chatLog = document.getElementById('chatLog');

    if (chatInput.trim()) {
        const userMessage = document.createElement('p');
        userMessage.textContent = `You: ${chatInput}`;
        chatLog.appendChild(userMessage);

        // Simulate a response
        const botMessage = document.createElement('p');
        botMessage.textContent = `Bot: This is a response related to your audio.`;
        chatLog.appendChild(botMessage);

        chatInput.value = '';
        chatLog.scrollTop = chatLog.scrollHeight;
    }
}
