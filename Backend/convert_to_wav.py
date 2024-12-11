import moviepy.editor as mp
from pydub import AudioSegment
import librosa
import noisereduce as nr
import soundfile as sf
import mimetypes
import os


def mp3_to_wav(file_path):
    output_file = "temp.wav"
    sound = AudioSegment.from_mp3(file_path)
    sound.export(output_file, "wav")

def mp4_to_wav(file_path):
    output_file = "temp.wav"
    try:
        video = mp.VideoFileClip(file_path)
        audio = video.audio
        audio.write_audiofile(output_file, codec="pcm_s16le")
        audio.close()
        video.close()
        print(f"Conversion complete. WAV file saved at: {output_file}")
    except Exception as e:
        print(f"Error converting MP4 to WAV: {e}")
    return output_file

def convert(path):
    mime_type, _ = mimetypes.guess_type(path)
    file_extension = os.path.splitext(path)[1].lower()
    if file_extension == ".mp3" or mime_type == "audio/mpeg":
        mp3_to_wav(path)
    else:
        mp4_to_wav(path)


# if __name__ == '__main__':
#     # path = "Test audio/CallRecording3.mp3"
#     path = "Test videos/Cervical_spine.mp4"
#     convert(path)