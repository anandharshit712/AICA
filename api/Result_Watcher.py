import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler 
import requests
import logging
#Use this code after enabling the events section in Flask Server Endpoint
LOG_FILE = "D:/Transcript_summarizer/Log/api_log.txt"
logging.basicConfig(filename=LOG_FILE, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class Watcher:
    DIRECTORY_TO_WATCH = "D:/webServer/Beamhash/api/Results"

    def __init__(self):
        self.observer = Observer()

    def run(self):
        event_handler = Handler()
        self.observer.schedule(event_handler, self.DIRECTORY_TO_WATCH, recursive=True)
        self.observer.start()
        logging.info(f"Monitoring directory: {self.DIRECTORY_TO_WATCH}")
        try:
            while True:
                time.sleep(5)
        except:
            self.observer.stop()
            print("Observer Stopped")

        self.observer.join()


class Handler(FileSystemEventHandler):

    def on_created(self, event):
        if event.is_directory:
            return None
        else:
            logging.info(f"New file found: {event.src_path}")
            file_path = event.src_path
            logging.info(f"sending file to webpage!!")
            send_file_to_endpoint(file_path)


def send_file_to_endpoint(file_path):
    with open(file_path, 'r') as f:
        file_content = f.read()

    response = requests.post('https://api.beamhash.com/process-file', json={'content': file_content})
    if response.status_code == 200:
        print('File content sent successfully')
        logging.info(f"File content sent successfully")
    else:
        print('Failed to send file content')
        logging.info(f"Failed to send file content")

if __name__ == '__main__':
    w = Watcher()
    w.run()
