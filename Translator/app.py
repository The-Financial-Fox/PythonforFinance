import streamlit as st
import speech_recognition as sr
from groq import Groq
import os
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    st.error("🚨 API Key is missing! Set it in .env file or Streamlit secrets.")
    st.stop()

# Initialize GROQ client
client = Groq(api_key=GROQ_API_KEY)

# Streamlit UI setup
st.set_page_config(page_title="🎙️ Live Spanish-English Translator", page_icon="🗣️", layout="centered")
st.title("🎙️ Live Spanish to English Translator")
st.markdown("Click the button below to start listening to Spanish speech and get live English translations.")

start_button = st.button("🎤 Start Listening")

# Set up placeholders for live feedback
status_placeholder = st.empty()
spanish_text_placeholder = st.empty()
english_text_placeholder = st.empty()

if start_button:
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    with mic as source:
        recognizer.adjust_for_ambient_noise(source)
        status_placeholder.info("🎧 Listening... Speak Spanish now!")

        try:
            while True:
                audio = recognizer.listen(source, phrase_time_limit=5)
                status_placeholder.info("🛠️ Processing...")

                try:
                    # Speech-to-text in Spanish
                    spanish_text = recognizer.recognize_google(audio, language="es")
                    spanish_text_placeholder.success(f"🗣️ Spanish: {spanish_text}")

                    # Translation using Groq
                    prompt = f"Translate this Spanish sentence into English: {spanish_text}"
                    response = client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": "You are a professional Spanish-to-English translator."},
                            {"role": "user", "content": prompt}
                        ],
                        model="llama3-8b-8192"
                    )

                    english_translation = response.choices[0].message.content.strip()
                    english_text_placeholder.success(f"✅ English: {english_translation}")

                except sr.UnknownValueError:
                    spanish_text_placeholder.warning("Could not understand the audio.")
                except sr.RequestError as e:
                    st.error(f"Speech Recognition error: {e}")
                    break

                time.sleep(0.5)

        except KeyboardInterrupt:
            status_placeholder.info("🛑 Stopped listening.")
