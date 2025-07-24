import streamlit as st
import speech_recognition as sr
from groq import Groq
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    st.error("🚨 API Key is missing! Set it in .env file or Streamlit secrets.")
    st.stop()

# Initialize GROQ client
client = Groq(api_key=GROQ_API_KEY)

# Streamlit UI
st.set_page_config(page_title="🎙️ Arabic to English Translator", page_icon="🗣️", layout="centered")
st.title("🎙️ Arabic to English Voice Translator")
st.markdown("Upload an Arabic voice recording (WAV format) to translate it to English.")

uploaded_file = st.file_uploader("📤 Upload your Arabic voice (WAV only)", type=["wav"])

if uploaded_file is not None:
    try:
        recognizer = sr.Recognizer()
        with sr.AudioFile(uploaded_file) as source:
            st.info("🔊 Processing audio...")
            audio = recognizer.record(source)

        # Speech-to-text in Arabic
        arabic_text = recognizer.recognize_google(audio, language="ar")
        st.success(f"🗣️ Arabic Detected: {arabic_text}")

        # Translate using Groq
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
        st.error("❌ Could not understand the audio.")
    except sr.RequestError as e:
        st.error(f"❌ Speech Recognition error: {e}")
    except Exception as e:
        st.error(f"❌ Unexpected error: {e}")
