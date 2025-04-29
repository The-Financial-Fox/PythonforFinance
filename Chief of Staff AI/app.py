import streamlit as st
import pandas as pd
import docx
import os
from groq import Groq
from dotenv import load_dotenv

# Load API Key
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    st.error("🚨 Missing GROQ_API_KEY. Please add it to .env or Streamlit Secrets.")
    st.stop()

# Streamlit App Setup
st.set_page_config(page_title="Chief of Staff AI", page_icon="🧠", layout="wide")
st.title("🧠 Chief of Staff AI: Turn Meeting Notes into Action Plans")

st.markdown("Upload a **meeting transcript** (text or .docx) and I'll extract **Action Items**, assign **Owners**, and suggest **Deadlines**.")

# File upload
uploaded_file = st.file_uploader("📁 Upload meeting transcript (Text or Word Doc)", type=["txt", "docx"])

transcript_text = ""

# Process uploaded file
if uploaded_file:
    if uploaded_file.name.endswith(".txt"):
        transcript_text = uploaded_file.read().decode("utf-8")
    elif uploaded_file.name.endswith(".docx"):
        doc = docx.Document(uploaded_file)
        transcript_text = "\n".join([para.text for para in doc.paragraphs])
    
    st.success("✅ Transcript loaded successfully!")

# Text input fallback
manual_text = st.text_area("✍️ Or paste your meeting transcript here:")

# Prioritize uploaded file over manual text
final_transcript = transcript_text if transcript_text else manual_text

# Ask question
if st.button("🚀 Generate Action Plan"):
    if not final_transcript.strip():
        st.warning("Please upload a file or paste some text.")
    else:
        client = Groq(api_key=GROQ_API_KEY)

        prompt = f"""
        You are an AI Chief of Staff.
        Your task:
        1. Read the meeting transcript below.
        2. Extract a list of clear action items.
        3. For each action item, assign an Owner (based on mentions, or suggest if not clear).
        4. Set or suggest a realistic Deadline (e.g., '3 days', '1 week', 'by Friday').
        5. Return the output as a clean table with columns: Action Item, Owner, Deadline.

        Meeting Transcript:
        {final_transcript}
        """

        try:
            response = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a highly skilled Chief of Staff AI assistant."},
                    {"role": "user", "content": prompt}
                ],
                model="llama3-8b-8192"  # You can allow model selection too if you want
            )

            output = response.choices[0].message.content
            st.subheader("📋 Generated Action Plan")
            st.markdown(output)

        except Exception as e:
            st.error(f"❌ Error: {str(e)}")
