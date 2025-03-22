import os

def get_config():
    return {
        "whisper_model_size": os.environ.get("WHISPER_MODEL_SIZE", "base"),
        "device": "cuda" if torch.cuda.is_available() else "cpu",
        "supabase_url": os.environ.get("SUPABASE_URL", 'https://your-default-url.supabase.co'),
        "supabase_key": os.environ.get("SUPABASE_KEY", 'your-supabase-key')
    }

#         audio_path = "temp_audio.wav"
#     audio_file.save(audio_path)
