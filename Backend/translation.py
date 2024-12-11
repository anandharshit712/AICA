from libretranslatepy import LibreTranslateAPI


def translate_file(input_filename, destination_language, api_url="http://127.0.0.1:5000/"):

    lt = LibreTranslateAPI(api_url)

    with open(input_filename, 'r', encoding='utf-8') as file:
        input_text = file.read()

    # Detect the source language
    detected_language = lt.detect(input_text)[0]['language']
    print(f"Detected source language: {detected_language}")

    # Translate the text
    translated_text = lt.translate(input_text, detected_language, destination_language)

    # Save the translated text to a new file
    output_file = input_filename.replace('.txt', f'_{destination_language}.txt')
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(translated_text)

    print(f"Translation saved to {output_file}")

    return translated_text


# Example usage:
# input_file = 'Transcript_main/transcript_main_CallRecording3.txt'
# translated_text = translate_file(input_file, destination_language="en")
# print(translated_text)
