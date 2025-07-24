import streamlit as st
import speech_recognition as sr
from groq import Groq
import os
from dotenv import load_dotenv

# Load API key securely
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    st.error("🚨 API Key is missing! Set it in .env file or Streamlit secrets.")
    st.stop()

# Streamlit UI
st.set_page_config(page_title="🎙️ Arabic to English Voice Translator", page_icon="🗣️", layout="centered")
st.title("🎙️ Arabic to English Voice Translator")
st.markdown("Press the button to speak Arabic. Your speech will be translated to English using AI.")

# GROQ client
client = Groq(api_key=GROQ_API_KEY)

# Start recording on button click
if st.button("🎤 Start Listening (Speak Arabic)"):
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        st.info("🎧 Listening... Please speak Arabic.")
        audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)

    try:
        # Recognize Arabic
        arabic_text = recognizer.recognize_google(audio, language="ar")
        st.success(f"🗣️ Arabic Detected: {arabic_text}")

        # GROQ Translation
        prompt = f"Translate this Arabic sentence into English: {arabic_text}"
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a professional Arabic-to-English translator."},
                {"role": "user", "content": prompt}
            ],
            model="llama3-8b-8192"
        )

        english_translation = response.choices[0].message.content.strip()
        st.subheader("✅ English Translation:")
        st.success(english_translation)

    except sr.UnknownValueError:
        st.error("❌ Could not understand audio.")
    except sr.RequestError as e:
        st.error(f"❌ Speech Recognition error: {e}")
    except Exception as e:
        st.error(f"❌ Error: {e}")
