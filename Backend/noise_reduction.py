import noisereduce as nr
import librosa
import soundfile as sf

def noise_reduction(audio_file):
    print("Removing Noise form the audio file...")
    audio_data, sample_rate = librosa.load(audio_file)
    reduced_noise = nr.reduce_noise(y=audio_data, sr=sample_rate)
    sf.write("temp.wav", reduced_noise, sample_rate)
    print("Noise Reduction Complete")

# audio_file = "temp.wav"
# noise_reduction(audio_file)