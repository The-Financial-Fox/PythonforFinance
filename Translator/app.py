import speech_recognition as sr
import pyttsx3
from groq import Groq
import os
from dotenv import load_dotenv

# Load .env if you store GROQ_API_KEY there
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("❌ GROQ_API_KEY is missing in .env file.")
    exit()

client = Groq(api_key=GROQ_API_KEY)

# Initialize TTS engine
engine = pyttsx3.init()

# Initialize recognizer
recognizer = sr.Recognizer()
mic = sr.Microphone()

print("🎙️ Say something in Spanish...")

with mic as source:
    recognizer.adjust_for_ambient_noise(source)
    audio = recognizer.listen(source)

try:
    print("🛠️ Recognizing...")
    spanish_text = recognizer.recognize_google(audio, language="es")
    print(f"🗣️ Spanish: {spanish_text}")

    # Translate using Groq
    prompt = f"Translate this Spanish sentence into English: {spanish_text}"
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are a professional Spanish-to-English translator."},
            {"role": "user", "content": prompt}
        ],
        model="llama3-8b-8192"
    )

    english_translation = response.choices[0].message.content.strip()
    print(f"✅ English: {english_translation}")

    # Optional: Speak the translation
    engine.say(english_translation)
    engine.runAndWait()

except sr.UnknownValueError:
    print("❌ Could not understand the audio.")
except Exception as e:
    print(f"❌ Error: {e}")
