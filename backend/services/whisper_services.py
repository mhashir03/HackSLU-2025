import whisper
import logging
import tempfile
import os

logger = logging.getLogger(__name__)

def load_whisper_model(config):
    logger.info(f"Loading Whisper {config['whisper_model_size']} model...")
    model = whisper.load_model(config["whisper_model_size"], device=config["device"])
    logger.info("Whisper model loaded successfully")
    return model

def transcribe_audio(model, audio_path, language_hint):
    try:
        result = model.transcribe(audio_path, language=language_hint, fp16=(config['device'] == "cuda"))
        return {
            "text": result["text"],
            "language": result["language"]
        }
    except Exception as e:
        logger.error(f"Error transcribing audio: {str(e)}")
        raise e
