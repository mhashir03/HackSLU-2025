from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline
import logging

logger = logging.getLogger(__name__)
translation_models = {}

def load_translation_model(source_lang, target_lang, device):
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
            raise e
    return translation_models.get(key)

def translate_text(translator, text):
    try:
        translation = translator(text, max_length=512)
        return translation[0]['translation_text']
    except Exception as e:
        logger.error(f"Error translating text: {str(e)}")
        raise e
