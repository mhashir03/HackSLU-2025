from flask import Blueprint, request, jsonify
from services.whisper_service import load_whisper_model, transcribe_audio
import tempfile
import os

speech_bp = Blueprint('speech', __name__)

@speech_bp.route('/recognize', methods=['POST'])
def recognize_speech():
    if 'audio_file' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio_file']
    source_lang = request.form.get('source_lang', None)

    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, "audio.wav")
    audio_file.save(temp_path)

    try:
        config = get_config()
        whisper_model = load_whisper_model(config)
        result = transcribe_audio(whisper_model, temp_path, source_lang)
        return jsonify(result)
    finally:
        os.remove(temp_path)
        os.rmdir(temp_dir)
