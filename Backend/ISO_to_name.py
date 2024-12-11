def iso_to_language_name(iso_code):
    language_dict = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'ru': 'Russian',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'pt': 'Portuguese',
        'it': 'Italian',
        'nl': 'Dutch',
        'sv': 'Swedish',
        'pl': 'Polish',
        'tr': 'Turkish',
        'el': 'Greek',
        'th': 'Thai',
        'vi': 'Vietnamese',
        'he': 'Hebrew',
        'fa': 'Persian (Farsi)',
        'ur': 'Urdu',
        'bn': 'Bengali'
    }

    return language_dict.get(iso_code, "Unknown ISO code")

#
# # Example usage:
# iso_code = 'bn'
# language_name = iso_to_language_name(iso_code)
# print(f"The language for ISO code '{iso_code}' is '{language_name}'.")
