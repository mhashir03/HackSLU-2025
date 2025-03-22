from flask import Blueprint, request, jsonify
from services.translation_service import load_translation_model, translate_text

translation_bp = Blueprint('translation', __name__)

@translation_bp.route('/translate', methods=['POST'])
def translate_text_route():
    data = request.json
    if not data or 'text' not in data or 'source_lang' not in data or 'target_lang' not in data:
        return jsonify({"error": "Missing required parameters: text, source_lang, target_lang"}), 400
    
    text = data['text']
    source_lang = data['source_lang']
    target_lang = data['target_lang']

    if source_lang == target_lang:
        return jsonify({"translated_text": text})

    translator = load_translation_model(source_lang, target_lang)
    if not translator:
        return jsonify({"error": "Translation model not found"}), 404

    translated_text = translate_text(translator, text)
    return jsonify({"translated_text": translated_text})
