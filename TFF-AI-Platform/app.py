import streamlit as st
import pandas as pd
import PyPDF2
import os
from io import StringIO
from dotenv import load_dotenv
from groq import Groq

# Load API key
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Streamlit UI config
st.set_page_config(page_title="🦊 The Financial Fox Corporate AI", page_icon="🦊", layout="wide")
st.markdown("<h1 style='text-align: center; color: #5B2C6F;'>🦊 The Financial Fox Corporate AI Platform</h1>", unsafe_allow_html=True)

# Sidebar: Select model
st.sidebar.subheader("🧠 Choose Your LLM")
model = st.sidebar.selectbox("Select a model", [
    "llama3-8b-8192",
    "mixtral-8x7b-32768",
    "gemma-7b-it",
    "distil-whisper-large-v3-en",
    "gemma2-9b-it",
    "whisper-large-v3",
    "llama3-70b-8192",
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile"
])

# Sidebar: File upload
st.sidebar.subheader("📁 Upload Files")
uploaded_file = st.sidebar.file_uploader("Upload a PDF, Excel, or CSV file", type=["pdf", "xlsx", "xls", "csv"])

file_text = ""
if uploaded_file:
    if uploaded_file.name.endswith(".pdf"):
        reader = PyPDF2.PdfReader(uploaded_file)
        file_text = "\n".join([page.extract_text() for page in reader.pages])
    elif uploaded_file.name.endswith((".xlsx", ".xls")):
        df = pd.read_excel(uploaded_file)
        file_text = df.to_csv(index=False)
    elif uploaded_file.name.endswith(".csv"):
        stringio = StringIO(uploaded_file.getvalue().decode("utf-8"))
        df = pd.read_csv(stringio)
        file_text = df.to_csv(index=False)
    st.sidebar.success("✅ File uploaded successfully!")

# Main area: Ask a question
st.subheader("💬 Ask the Financial Fox")
user_question = st.text_area("Ask a question about finance, FP&A, modeling, or your uploaded data:")

if st.button("🚀 Get Answer"):
    if not GROQ_API_KEY:
        st.error("Missing GROQ_API_KEY. Please set it in Streamlit Secrets or a .env file.")
    elif not user_question.strip():
        st.warning("Please enter a question.")
    else:
        client = Groq(api_key=GROQ_API_KEY)

        prompt = f"""
        You are The Financial Fox, an AI expert in finance, FP&A, financial modeling, and data storytelling.
        Analyze the user’s question and provide a helpful, accurate, and practical answer.

        User Question:
        {user_question}

        { "Uploaded File Content:\n" + file_text if file_text else "No file uploaded." }
        """

        try:
            response = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a corporate finance AI assistant."},
                    {"role": "user", "content": prompt}
                ],
                model=model
            )

            ai_response = response.choices[0].message.content
            st.subheader("🧠 The Financial Fox Says")
            st.write(ai_response)

        except Exception as e:
            st.error(f"❌ Error: {str(e)}")
