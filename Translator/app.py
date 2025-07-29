import streamlit as st
from streamlit_webrtc import webrtc_streamer, AudioProcessorBase
import av
import numpy as np
import queue
import os
import tempfile
import wave
import speech_recognition as sr
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    st.error("🚨 API Key is missing! Set it in .env file or Streamlit secrets.")
    st.stop()

# Initialize GROQ client
client = Groq(api_key=GROQ_API_KEY)

# Streamlit UI
st.set_page_config(page_title="🎙️ Spanish to English Translator", page_icon="🗣️")
st.title("🎙️ Live Spanish to English Translator")
st.markdown("Speak Spanish into your microphone and get live English translations!")

# Audio data buffer
audio_queue = queue.Queue()

# Audio processor for webrtc
class AudioProcessor(AudioProcessorBase):
    def recv(self, frame: av.AudioFrame) -> av.AudioFrame:
        pcm = frame.to_ndarray().flatten()
        audio_queue.put(pcm)
        return frame

# Start WebRTC audio stream
webrtc_ctx = webrtc_streamer(
    key="translate-speech",
    mode="SENDRECV",
    audio_processor_factory=AudioProcessor,
    media_stream_constraints={"audio": True, "video": False},
    async_processing=True,
)

# Live translation section
if webrtc_ctx.state.playing:
    st.info("🎧 Listening... Speak in Spanish!")

    recognizer = sr.Recognizer()

    while True:
        # Collect ~3 seconds of audio
        frames = []
        for _ in range(30):
            try:
                chunk = audio_queue.get(timeout=1)
                frames.append(chunk)
            except queue.Empty:
                break

        if frames:
            # Save audio to temporary WAV file
            tmp_path = tempfile.mktemp(suffix=".wav")
            with wave.open(tmp_path, 'wb') as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)  # 16-bit
                wf.setframerate(48000)
                wf.writeframes(np.concatenate(frames).astype(np.int16).tobytes())

            try:
                # Convert Spanish speech to text
                with sr.AudioFile(tmp_path) as source:
                    audio = recognizer.record(source)
                    spanish_text = recognizer.recognize_google(audio, language="es")
                    st.success(f"🗣️ Spanish: {spanish_text}")

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
                    st.success(f"✅ English: {english_translation}")

            except sr.UnknownValueError:
                st.warning("⚠️ Could not understand the speech.")
            except Exception as e:
                st.error(f"❌ Error: {e}")
