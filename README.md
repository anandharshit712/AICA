# AICA

AICA (Audio Intelligent Conversational Agent) is a cutting-edge project designed to analyze audio content, transcribe it into text, and perform multilingual translations and summaries. This repository contains the codebase and instructions to set up and use AICA on your local machine.

## Features

- **Audio Transcription**: Converts audio files into text with high accuracy.
- **Multilingual Translation**: Translates transcribed content into multiple languages with support for common global languages.
- **Content Summarization**: Provides concise summaries of transcribed content, enabling quick insights.
- **Customizable Workflows**: Easily adapt and extend functionalities to suit specific needs and requirements.
- **Scalable Processing**: Capable of handling large audio files with efficient resource management.
- **GPU Acceleration Support**: Leverages GPU for faster processing, reducing the time required for transcription and translation.

## Prerequisites

Before you start, ensure you have the following installed on your system:

- **Python (>=3.8)**: A modern version of Python to run the code.
- **pip**: Python package installer for managing dependencies.
- **GPU with CUDA Support (Optional)**: Recommended for faster processing of large audio files.
- **FFmpeg**: Required for handling audio file formats.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anandharshit712/AICA.git
   cd AICA
   ```

2. Set up a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # For Linux/macOS
   venv\Scriptsctivate    # For Windows
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Install FFmpeg (if not already installed):
   - **Linux/macOS**: Use the package manager (e.g., `sudo apt install ffmpeg`).
   - **Windows**: Download and install FFmpeg from [FFmpeg's website](https://ffmpeg.org/).

## Usage

1. Place your audio files in the `audio_files` directory or specify the path directly during execution.

2. Run the transcription and translation script:
   ```bash
   python main.py --input <audio_file_path> --output <output_file_path> --language <target_language>
   ```

   Example:
   ```bash
   python main.py --input audio_files/sample.mp3 --output results.txt --language fr
   ```

   Parameters:
   - `--input`: Path to the input audio file.
   - `--output`: Path to the output text file where results will be saved.
   - `--language`: Target language code for translation (e.g., `en` for English, `fr` for French).

3. View the results in the specified output file.

4. For summarization, use the optional `--summarize` flag:
   ```bash
   python main.py --input <audio_file_path> --output <output_file_path> --language <target_language> --summarize
   ```

## Contributing

Contributions are welcome! If you encounter issues or have ideas for improvements, please feel free to submit an issue or a pull request.

### How to Contribute

1. **Fork the repository**: Click the fork button on GitHub to create a copy in your account.
2. **Clone the forked repository**: Download the code to your local machine.
   ```bash
   git clone https://github.com/<your-username>/AICA.git
   cd AICA
   ```
3. **Create a new branch**: Work on your changes in a dedicated branch.
   ```bash
   git checkout -b feature-branch
   ```
4. **Make your changes**: Implement your feature or fix.
5. **Commit your changes**: Document your work with a clear commit message.
   ```bash
   git commit -m 'Add new feature or fix'
   ```
6. **Push to your branch**:
   ```bash
   git push origin feature-branch
   ```
7. **Open a pull request**: Submit your changes for review on GitHub.


## Contact

For questions or support, contact [Harshit Anand](https://github.com/anandharshit712) or open an issue in this repository.

---

Enjoy using AICA and make your audio content work smarter for you!
