import os
import sys
import time
import logging
from langchain_ollama import OllamaLLM
from language_detect_test import detect_lang
from noise_reduction import noise_reduction
from translation import translate_file
from convert_to_wav import convert
from ISO_to_name import iso_to_language_name
from whisper_1 import transcribe
import assemblyai as aai

# Initialize logging
LOG_FILE = "Log/process_log.txt"
logging.basicConfig(filename=LOG_FILE, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Disable logging for HTTP requests
# logging.getLogger("urllib3").setLevel(logging.WARNING)
# logging.getLogger("requests").setLevel(logging.WARNING)
# logging.getLogger("http.client").setLevel(logging.WARNING)

aai.settings.api_key = "4da02acda77448cd8368d9d100fde23f"
ollama = OllamaLLM(base_url="http://localhost:11434", model="llama3.1")


def language_detection(file_path):
    logging.info(f"Starting language detection for {file_path}")
    detected_language = detect_lang(file_path)
    logging.info(f"Detected language: {detected_language}")
    return detected_language


def process_audio(file_path):
    logging.info(f"Starting audio processing for {file_path}")
    convert(file_path)
    logging.info("Audio conversion complete. Reducing noise...")
    noise_reduction("temp.wav")
    logging.info("Noise reduction complete.")


def whisper_transcript(file_path, language):
    logging.info(f"Creating transcript using Whisper for {file_path} in language {language}")
    transcript = transcribe(file_path, language)
    logging.info("Transcript creation complete.")
    return transcript


def translate(file, target_language):
    logging.info(f"Translating file {file} to {target_language}")
    translated_text = translate_file(file, target_language)
    logging.info("Translation complete.")
    return translated_text


def create_transcript(file_path):
    language = language_detection(file_path)
    language_name = iso_to_language_name(language)
    logging.info(f"Audio language: {language_name}")
    # print(f"Audio Language: {language_name}")
    # print("Creating transcript...")

    if language == "en":
        # logging.info("Using AssemblyAI for transcription in English")
        config = aai.TranscriptionConfig()
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(file_path, config=config)
        logging.info("English transcription complete.")
        return transcript.text
    else:
        logging.info("Using Whisper for non-English transcription")
        transcript = whisper_transcript(file_path, language)
        logging.info("Non-English transcription complete.")
        return transcript


def LLM(transcript, question):
    prompt = transcript + question
    logging.info("Sending transcript to LLM for response")
    try:
        response = ollama(prompt)
        logging.info("Received response from LLM")
        return response
    except Exception as e:
        logging.error(f"Failed to get response from LLM model: {e}")
        print(f"Failed to get response from LLM model: {e}\nExiting...")
        return


def save_files(content, file_path):
    logging.info(f"Saving file to {file_path}")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    logging.info("File saved successfully")


def main(path):
    logging.info("Starting main process")
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
        eng_transcript = translate(os.path.join(transcript_path + "/Original_language", f"{audio_file_name}_ori.txt"),
                                   "en")
        save_files(eng_transcript, os.path.join(transcript_path + "/English", f"{audio_file_name}_eng.txt"))

    query = "Summarize"
    LLM_response = LLM(eng_transcript, query)
    logging.info("Getting LLM response...")
    save_files(LLM_response, os.path.join(response_path + "/English", f"{audio_file_name}_eng.txt"))

    if original_language != "en":
        ori_lang_response = translate(os.path.join(response_path + "/English", f"{audio_file_name}_eng.txt"),
                                      original_language)
        save_files(ori_lang_response, os.path.join(response_path + "/Original_language", f"{audio_file_name}_ori.txt"))

    logging.info("Main process complete")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_path = sys.argv[1]
        # input_path = "CallRecording2.mp3"
        logging.info(f"Script started with file path: {input_path}")
        st = time.time()
        main(input_path)
        et = time.time()
        execution_time = et - st
        logging.info(f"Execution time: {execution_time:.6f} seconds")
        # print(f"Execution time: {execution_time:.6f} seconds")
    else:
        logging.error("No file path provided.")
        # print("No file path provided.")
