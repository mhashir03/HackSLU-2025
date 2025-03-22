import os

def get_config():
    return {
        "whisper_model_size": os.environ.get("WHISPER_MODEL_SIZE", "base"),
        "device": "cuda" if torch.cuda.is_available() else "cpu",
        "supabase_url": os.environ.get("SUPABASE_URL", 'https://kxmqhjwwylomedrvjuzl.supabase.co'),
        "supabase_key": os.environ.get("SUPABASE_KEY", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bXFoand3eWxvbWVkcnZqdXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Njk5NzcsImV4cCI6MjA1ODI0NTk3N30.ekbsKB3nY8c9IgfTmlcNxTk781esT6g-5ZpCT3ZS8oc')
    }

#     audio_path = "temp_audio.wav"
#     audio_file.save(audio_path)
