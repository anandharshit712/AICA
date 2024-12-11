import os, time, subprocess
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

INPUT_DIR = "D:/webServer/Beamhash/api/upload/"
OUTPUT_DIR = "Output_data"
SCRIPT_PATH = "main2_log_updated.py"
PROCESSED_DIR = "Input_data/temp"
AUDIO_EXTENSION = ['.wav', '.mp3', '.flac', '.acc', '.m4a', '.webm']
LOG_FILE = "Log/log.txt"

class NewFileHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory and self.is_audio_file(event.src_path):
            print(f"New audio file detected: {event.src_path}")
            self.log_file(event.src_path, "detected")
            self.process_file(event.src_path)


    def is_audio_file(self, filepath):
        _, extention = os.path.splitext(filepath)
        return extention.lower() in  AUDIO_EXTENSION

    def process_file(self, filepath):
        try:
            self.log_file(filepath, "starting audio process")
            subprocess.run(['python', SCRIPT_PATH, filepath], check = True)
            print(f"Processed File: {filepath}")
            self.log_file(filepath, "processed")

            if PROCESSED_DIR:
                os.makedirs(PROCESSED_DIR, exist_ok = True)
                filename = os.path.basename(filepath)
                destination = os.path.join(PROCESSED_DIR, filename)
                os.rename(filepath, destination)
                print(f"Moved processed file to: {destination}")

        except subprocess.CalledProcessError as e:
            print(f"Error Processing file {filepath}")
        except Exception as e:
            print(f"Unexpected error: {e}")

    def log_file(self, filepath, event_type):
        with open(LOG_FILE, "a") as log:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            if event_type == "detected":
                log.write(f"{timestamp} - Detected file: {filepath}\n")
            elif event_type == "starting audio process":
                log.write(f"{timestamp} - Starting audio process for: {filepath}\n")
            else:
                log.write(f"{timestamp} - Processed file: {filepath}\n")

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(PROCESSED_DIR, exist_ok=True)

    event_handler = NewFileHandler()
    observer = Observer()
    observer.schedule(event_handler, path = INPUT_DIR, recursive=False)
    observer.start()
    print(f"Monitoring {INPUT_DIR} for any new files...")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    main()
