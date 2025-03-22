import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import torch
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
import logging

"""
Speech-to-Text Application Backend for Users with Speech Impediments

This is the main entry point for the backend which provides:
1. Speech recognition capabilities using OpenAI's Whisper API
2. Translation services to convert recognized text to different languages
3. API endpoints for the frontend to interact with

Main components:
- Flask web server for API endpoints
- OpenAI Whisper for speech recognition
- Translation services

Author: Nilesh Gupta
Date: 03-22-2025
"""


# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Check for GPU availability
device = "cuda" if torch.cuda.is_available() else "cpu"
logger.info(f"Using device: {device}")

# Load Whisper model
# Options: "tiny", "base", "small", "medium", "large"
WHISPER_MODEL_SIZE = os.environ.get("WHISPER_MODEL_SIZE", "base")
logger.info(f"Loading Whisper {WHISPER_MODEL_SIZE} model...")
whisper_model = whisper.load_model(WHISPER_MODEL_SIZE, device=device)
logger.info("Whisper model loaded successfully")

# Initialize translation models
# We'll use Helsinki-NLP/opus-mt models from Hugging Face
translation_models = {}

def load_translation_model(source_lang, target_lang):
    """
    Load a translation model for a specific language pair.
    
    Args:
        source_lang: Source language code (e.g., 'en' for English)
        target_lang: Target language code (e.g., 'es' for Spanish)
        
    Returns:
        Translation pipeline
    """
    model_name = f"Helsinki-NLP/opus-mt-{source_lang}-{target_lang}"
    key = f"{source_lang}-{target_lang}"
    
    if key not in translation_models:
        try:
            logger.info(f"Loading translation model: {model_name}")
            model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            translation_models[key] = pipeline("translation", model=model, tokenizer=tokenizer, device=device)
            logger.info(f"Translation model {model_name} loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load translation model {model_name}: {str(e)}")
            return None
            
    return translation_models.get(key)

@app.route('/recognize', methods=['POST'])
def recognize_speech():
    """
    Endpoint to recognize speech from an audio file.
    
    Expects:
        - audio_file: The audio file to transcribe
        - source_lang: (Optional) Source language code (e.g., 'en' for English)
    
    Returns:
        JSON with recognized text
    """
    if 'audio_file' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio_file']
    source_lang = request.form.get('source_lang', None)
    
    # Save the audio file temporarily
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, "audio.wav")
    audio_file.save(temp_path)
    
    try:
        # Transcribe with Whisper
        logger.info(f"Transcribing audio with source language hint: {source_lang}")
        result = whisper_model.transcribe(
            temp_path, 
            language=source_lang,
            fp16=(device == "cuda")
        )
        
        return jsonify({
            "text": result["text"],
            "language": result["language"]
        })
    except Exception as e:
        logger.error(f"Error transcribing audio: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        os.rmdir(temp_dir)

@app.route('/translate', methods=['POST'])
def translate_text():
    """
    Endpoint to translate text from one language to another.
    
    Expects:
        - text: The text to translate
        - source_lang: Source language code (e.g., 'en' for English)
        - target_lang: Target language code (e.g., 'es' for Spanish)
    
    Returns:
        JSON with translated text
    """
    data = request.json
    if not data or 'text' not in data or 'source_lang' not in data or 'target_lang' not in data:
        return jsonify({"error": "Missing required parameters: text, source_lang, target_lang"}), 400
    
    text = data['text']
    source_lang = data['source_lang']
    target_lang = data['target_lang']
    
    # Check if translation is needed
    if source_lang == target_lang:
        return jsonify({"translated_text": text})
    
    translator = load_translation_model(source_lang, target_lang)
    if not translator:
        return jsonify({"error": f"Translation from {source_lang} to {target_lang} is not supported"}), 400
    
    try:
        # Translate the text
        translation = translator(text, max_length=512)
        translated_text = translation[0]['translation_text']
        
        return jsonify({"translated_text": translated_text})
    except Exception as e:
        logger.error(f"Error translating text: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/recognize_and_translate', methods=['POST'])
def recognize_and_translate():
    """
    Endpoint to recognize speech and translate it to the desired language.
    
    Expects:
        - audio_file: The audio file to transcribe
        - target_lang: Target language code (e.g., 'es' for Spanish)
    
    Returns:
        JSON with original and translated text
    """
    if 'audio_file' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio_file']
    target_lang = request.form.get('target_lang')
    
    if not target_lang:
        return jsonify({"error": "Target language not specified"}), 400
    
    # Save the audio file temporarily
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, "audio.wav")
    audio_file.save(temp_path)
    
    try:
        # Transcribe with Whisper
        logger.info("Transcribing audio...")
        result = whisper_model.transcribe(temp_path, fp16=(device == "cuda"))
        
        original_text = result["text"]
        detected_lang = result["language"]
        
        # Check if translation is needed
        if detected_lang == target_lang:
            return jsonify({
                "original_text": original_text,
                "translated_text": original_text,
                "detected_language": detected_lang
            })
        
        # Load translation model
        translator = load_translation_model(detected_lang, target_lang)
        if not translator:
            return jsonify({
                "original_text": original_text,
                "error": f"Translation from {detected_lang} to {target_lang} is not supported",
                "detected_language": detected_lang
            }), 400
        
        # Translate the text
        translation = translator(original_text, max_length=512)
        translated_text = translation[0]['translation_text']
        
        return jsonify({
            "original_text": original_text,
            "translated_text": translated_text,
            "detected_language": detected_lang
        })
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        os.rmdir(temp_dir)

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "models": {
        "whisper": WHISPER_MODEL_SIZE,
        "translation_models": list(translation_models.keys())
    }})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
