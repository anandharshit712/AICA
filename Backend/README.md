
# AICA: Audio Intelligence and Conversational Agent

This repository contains tools and scripts for performing automatic speech recognition (ASR), speaker diarization, language detection, and summarization of audio conversations. Additionally, it includes an interactive conversational agent powered by the Mistral-NeMo local LLM model, allowing users to engage with and query the audio content in a more dynamic way.

## Features

- **Automatic Speech Recognition (ASR)**: Convert spoken language into text using the Whisper ASR model.
- **Speaker Diarization**: Identify and separate different speakers in an audio conversation.
- **Language Detection**: Detect the language spoken in an audio file.
- **Summarization**: Generate concise summaries of audio conversations using BERT or custom models.
- **Conversational Agent**: Chat with a local LLM (Mistral-NeMo) about the specific audio content to extract insights, ask questions, and interact with the data.
- **Audio Format Conversion**: Convert various audio formats to WAV, making them compatible with the processing pipeline.

## Repository Structure

- `main.py`: The main entry point for running the application.
- `audio.py`, `audio_transcript.py`: Scripts for handling audio data, including transcription and processing.
- `convert_to_wav.py`: Script for converting audio files to WAV format.
- `detect_language.py`: Script for detecting the language spoken in an audio file.
- `detect_speakers.py`: Script for performing speaker diarization.
- `Multilingual_ASR.ipynb`, `OpenAI_Whisper_ASR_Demo.ipynb`, `converting-speech-to-text.ipynb`: Jupyter notebooks demonstrating the use of ASR models and the processing pipeline.
- `whisper/`: Directory containing the Whisper ASR model and its associated scripts.
- `.gitignore`: Lists files and directories to be ignored by git.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AICA.git
   cd AICA
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. (Optional) Set up additional models or dependencies if required by specific scripts or notebooks.

## Usage

1. **Running the Main Application**:
   ```bash
   python main2.py
   ```
   This will execute the primary workflow, which may include converting audio files, detecting speakers, transcribing speech, summarizing the conversation, and launching the conversational agent.

2. **Using the Conversational Agent**:
   After processing the audio, you can chat with the Mistral-NeMo model to explore the content further:

3. **Using Jupyter Notebooks**:
   Open any of the provided Jupyter notebooks to explore the functionalities interactively. For example, you can run `OpenAI_Whisper_ASR_Demo.ipynb` to test the Whisper ASR model.

4. **Running Specific Scripts**:
   You can run individual scripts for specific tasks:
   ```bash
   python convert_to_wav.py --input your_audio_file.mp3
   python detect_language.py --input your_audio_file.wav
   ```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have suggestions, bug reports, or feature requests.

## Acknowledgements

- **Whisper**: A powerful ASR model developed by OpenAI.
- **BERT**: A state-of-the-art language model used for summarization tasks.
- **Mistral-NeMo**: The LLM model powering the conversational agent.
