import os
import sys
import time
from langchain_community.llms.ollama import Ollama
from language_detect_test import detect_lang
from noise_reduction import noise_reduction
from translation import translate_file
from convert_to_wav import convert
from ISO_to_name import iso_to_language_name
from whisper_1 import transcribe
import assemblyai as aai

# Log file path
LOG_FILE = "Log/process_log.txt"
RESPONSE_LOG =  "Log/LLM_response.txt"
AUDIO_EXTENSION = ['.mp3', '.flac', '.acc', '.m4a', '.webm']

aai.settings.api_key = "4da02acda77448cd8368d9d100fde23f"
ollama = Ollama(base_url="http://localhost:11434", model="mistral-nemo")

def write_log(message, level="INFO"):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a", encoding="utf-8") as log_file:
        log_file.write(f"{timestamp} - {level} - {message}\n")

def response_log(message, level="RESPONSE"):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    with open(RESPONSE_LOG, "a", encoding="utf-8") as log_file:
        log_file.write(f"{timestamp} - {level} - {message}\n")

def language_detection(file_path):
    try:
        write_log(f"Starting language detection for {file_path}")
        detected_language = detect_lang(file_path)  # Imported function
        write_log(f"Detected language: {detected_language}")
        return detected_language
    except Exception as e:
        write_log(f"Error in language detection for {file_path}: {e}", level="ERROR")
        raise

def process_audio(file_path):
    try:
        write_log(f"Starting audio processing for {file_path}")
        file_extension = os.path.splitext(file_path)[1].lower()
        if file_extension in AUDIO_EXTENSION:
            convert(file_path)
            write_log("Audio conversion complete. Reducing noise...")
            noise_reduction("temp.wav")
            write_log("Noise reduction complete.")
        else:
            write_log("Reducing Noise...")
            noise_reduction(file_path)
            write_log("Noise reduction complete.")
    except Exception as e:
        write_log(f"Error in audio processing for {file_path}: {e}", level="ERROR")
        raise

def whisper_transcript(file_path, language):
    try:
        write_log(f"Creating transcript using Whisper for {file_path} in language {language}")
        transcript = transcribe(file_path, language)  # Imported function
        write_log("Transcript creation complete.")
        return transcript
    except Exception as e:
        write_log(f"Error in Whisper transcription for {file_path}: {e}", level="ERROR")
        raise

def translate(file, target_language):
    try:
        write_log(f"Translating file {file} to {target_language}")
        translated_text = translate_file(file, target_language)  # Imported function
        write_log("Translation complete.")
        return translated_text
    except Exception as e:
        write_log(f"Error in translating file {file} to {target_language}: {e}", level="ERROR")
        raise

def create_transcript(file_path):
    try:
        language = language_detection(file_path)
        language_name = iso_to_language_name(language)  # Imported function
        write_log(f"Audio language: {language_name}")

        if language == "en":
            config = aai.TranscriptionConfig()
            transcriber = aai.Transcriber()
            transcript = transcriber.transcribe(file_path, config=config)  # AssemblyAI library function
            write_log("English transcription complete.")
            return transcript.text
        else:
            write_log("Using Whisper for non-English transcription")
            transcript = whisper_transcript(file_path, language)
            write_log("Non-English transcription complete.")
            return transcript
    except Exception as e:
        write_log(f"Error in creating transcript for {file_path}: {e}", level="ERROR")
        raise

def LLM(transcript, question):
    try:
        prompt = transcript + question
        write_log("Sending transcript to LLM for response")
        response = ollama(prompt)  # Imported function
        write_log("Received response from LLM")
        return response
    except Exception as e:
        write_log(f"Error in LLM processing: {e}", level="ERROR")
        raise

def save_files(content, file_path):
    try:
        write_log(f"Saving file to {file_path}")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        write_log("File saved successfully")
    except Exception as e:
        write_log(f"Error saving file to {file_path}: {e}", level="ERROR")
        raise

def main(path):
    try:
        write_log("Starting main process")
        response_path = "Output_data/Response"
        transcript_path = "Output_data/Transcript"
        audio_file_name = os.path.splitext(os.path.basename(path))[0]

        original_language = language_detection(path)
        process_audio(path)

        transcript = create_transcript("temp.wav")
        if original_language == "en":
            eng_transcript = transcript
            save_files(eng_transcript, os.path.join(transcript_path + "/English", f"{audio_file_name}_eng.txt"))
        else:
            save_files(transcript, os.path.join(transcript_path + "/Original_language", f"{audio_file_name}_ori.txt"))
            eng_transcript = translate(
                os.path.join(transcript_path + "/Original_language", f"{audio_file_name}_ori.txt"), "en"
            )
            save_files(eng_transcript, os.path.join(transcript_path + "/English", f"{audio_file_name}_eng.txt"))

        query = "Summarize"
        LLM_response = LLM(eng_transcript, query)
        write_log("Getting LLM response...")
        save_files(LLM_response, os.path.join(response_path + "/English", f"{audio_file_name}_eng.txt"))
        response_log(LLM_response)

        if original_language != "en":
            ori_lang_response = translate(
                os.path.join(response_path + "/English", f"{audio_file_name}_eng.txt"), original_language
            )
            save_files(ori_lang_response, os.path.join(response_path + "/Original_language", f"{audio_file_name}_ori.txt"))

        write_log("Main process complete")
    except Exception as e:
        write_log(f"Unexpected error in main process: {e}", level="ERROR")
        raise

if __name__ == "__main__":
    try:
        if len(sys.argv) > 1:
            input_path = sys.argv[1]
            write_log(f"Script started with file path: {input_path}")
            st = time.time()
            main(input_path)
            et = time.time()
            execution_time = et - st
            write_log(f"Execution time: {execution_time:.6f} seconds")
        else:
            write_log("No file path provided.", level="ERROR")
    except Exception as e:
        write_log(f"Fatal error in script execution: {e}", level="ERROR")
