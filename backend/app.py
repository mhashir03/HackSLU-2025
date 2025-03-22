from flask import Flask
from api.speech_routes import speech_bp
from api.translation_routes import translation_bp
from api.combined_routes import combined_bp

app = Flask(__name__)
app.register_blueprint(speech_bp)
app.register_blueprint(translation_bp)
app.register_blueprint(combined_bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


# In the code snippet above, we define a Flask application and register three blueprints:
# - speech_bp: Contains endpoints for speech recognition
# - translation_bp: Contains endpoints for translation
# - combined_bp: Contains combined endpoints for both speech recognition and translation

