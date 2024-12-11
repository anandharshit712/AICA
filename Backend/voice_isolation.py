import librosa
import numpy as np
import soundfile as sf

def voice_isolation(audio):
    y, sr = librosa.load(audio, sr = None)
    stft = librosa.stft(y)
    magnitude, phase = np.abs(stft), np.angle(stft)
    noise_profile = np.mean(magnitude[:,:int(sr*0.5)], axis=1)
    noise_threshold = 1.5 * noise_profile
    mask = magnitude > noise_threshold[:, np.newaxis]
    isolated_stft = stft * mask
    isolated_audio = librosa.istft(isolated_stft)
    sf.write('temp.wav', isolated_audio, sr)
    print("Isolated Audio Saved as temp.wav")
# Load audio file
# audio_path = 'Test audio/CallRecording3.mp3'
# voice_isolation(audio_path)
