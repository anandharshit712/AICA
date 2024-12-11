import whisper

# Load the model and set it to use the GPU
model = whisper.load_model('turbo').to('cuda')  # Move model to GPU

def transcribe(audio_file, detected_language):
    if detected_language:
        result = model.transcribe(audio_file)
        transcription = result['text']
        return transcription
    else:
        print("Language detection failed; skipping transcription and translation.")
        return None

# path = "CallRecording3.mp3"
# print(transcribe(path, "hi"))

