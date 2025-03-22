from flask import Blueprint, request, jsonify
from services.whisper_service import load_whisper_model, transcribe_audio
from services.translation_service import load_translation_model, translate_text
import tempfile
import os

combined_bp = Blueprint('combined', __name__)

@combined_bp.route('/recognize_and_translate', methods=['POST'])
def recognize_and_translate():
    if 'audio_file' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio_file']
    target_lang = request.form.get('target_lang')

    if not target_lang:
        return jsonify({"error": "Target language not specified"}), 400
    
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, "audio.wav")
    audio_file.save(temp_path)

    try:
        config = get_config()
        whisper_model = load_whisper_model(config)
        result = transcribe_audio(whisper_model, temp_path)
        
        detected_lang = result["language"]
        original_text = result["text"]
        
        if detected_lang == target_lang:
            return jsonify({
                "original_text": original_text,
                "translated_text": original_text,
                "detected_language": detected_lang
            })
        
        translator = load_translation_model(detected_lang, target_lang)
        if not translator:
            return jsonify({
                "original_text": original_text,
                "error": "Translation model not found",
                "detected_language": detected_lang
            }), 404
        
        translated_text = translate_text(translator, original_text)
        return jsonify({
            "original_text": original_text,
            "translated_text": translated_text,
            "detected_language": detected_lang
        })
    finally:
        os.remove(temp_path)
        os.rmdir(temp_dir)
