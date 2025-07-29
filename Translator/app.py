import streamlit as st
from streamlit_webrtc import webrtc_streamer, AudioProcessorBase
import av
import numpy as np
import queue
import os
from dotenv import load_dotenv
from groq import Groq
import tempfile
import wave
import speech_recognition as sr

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    st.error("🚨 API Key is missing! Set it in .env file or Streamlit secrets.")
    st.stop()

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

st.set_page_config(page_title="🎙️ Spanish to English Translator", page_icon="🗣️")
st.title("🎙️ Live Spanish to English Voice Translator")
st.markdown("Speak Spanish into your mic and receive English translations instantly!")

# Global audio queue
audio_queue = queue.Queue()

# WebRTC Audio Processor
class AudioProcessor(AudioProcessorBase):
    def recv(self, frame: av.AudioFrame) -> av.AudioFrame:
        pcm = frame.to_ndarray().flatten()
        audio_queue.put(pcm)
        return frame

# Stream audio using streamlit-webrtc
webrtc_ctx = webrtc_streamer(
    key="speech",
    mode="SENDRECV",
    audio_processor_factory=AudioProcessor,
    media_stream_constraints={"audio": True, "video": False},
    async_processing=True,
)

# Process audio chunks
if webrtc_ctx.state.playing:
    st.info("🎧 Listening... Speak Spanish now!")

    recognizer = sr.Recognizer()

    while True:
        # Collect ~3 seconds of audio
        frames = []
        for _ in range(30):
            try:
                pcm_chunk = audio_queue.get(timeout=1)
                frames.append(pcm_chunk)
            except queue.Empty:
                break

        if frames:
            # Save to temporary WAV file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmpfile:
                with wave.open(tmpfile.name, 'wb') as wf:
                    wf.setnchannels(1)
                    wf.setsampwidth(2)  # 16-bit
                    wf.setframerate(48000)
                    wf.writeframes(np.concatenate(frames).astype(np.int16).tobytes())

                try:
                    # Recognize speech in Spanish
                    with sr.AudioFile(tmpfile.name) as source:
                        audio_data = recognizer.record(source)
                        spanish_text = recognizer.recognize_google(audio_data, language="es")
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
                    st.warning("⚠️ Couldn't understand the audio.")
                except Exception as e:
                    st.error(f"❌ Error: {e}")
