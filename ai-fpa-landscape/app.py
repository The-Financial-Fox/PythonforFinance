# app.py

import streamlit as st
from streamlit_extras.stylable_container import stylable_container
from utils.filters import load_tools_from_json, filter_by_categories, search_tools
from config import CATEGORIES, ICON_MAP, TAG_COLORS

st.set_page_config(page_title="AI for FP&A Landscape by Christian Martinez", layout="wide")

# Custom background color
st.markdown(
    """
    <style>
    body {
        background-color: #fef8e7;
    }
    </style>
    """,
    unsafe_allow_html=True
)


# 🔖 Helper to render custom tags
def render_tag(label, color="lightgray"):
    st.markdown(
        f"<span style='background-color:{color};padding:4px 8px;border-radius:6px;"
        f"font-size:0.85rem;color:#333;margin-right:4px;'>{label}</span>",
        unsafe_allow_html=True
    )

# 📥 Load tools data
import pandas as pd

# 🚀 Expanded tool list with categories from your visual
embedded_tools_data = [
    # 🟦 Data Visualization
    {"name": "Tableau", "category": ["Visualization"], "status": "GA", "description": "Interactive data visualization platform.", "link": "https://www.tableau.com/", "logo": ""},
    {"name": "Power BI", "category": ["Visualization"], "status": "GA", "description": "Microsoft’s business analytics tool for interactive visualizations.", "link": "https://powerbi.microsoft.com/", "logo": ""},
    
    # 🟨 Programming & Scripting
    {"name": "Python", "category": ["Scripting", "AI Modeling"], "status": "GA", "description": "Powerful programming language widely used in finance and analytics.", "link": "https://www.python.org/", "logo": ""},
    {"name": "Jupyter", "category": ["Scripting"], "status": "GA", "description": "Open-source web app for interactive coding and data analysis.", "link": "https://jupyter.org/", "logo": ""},
    {"name": "SQL", "category": ["Scripting", "Data Manipulation"], "status": "GA", "description": "Structured Query Language for managing and querying databases.", "link": "https://www.mysql.com/", "logo": ""},
    
    # 🧾 Accounting & Month-End
    {"name": "Puzzle", "category": ["Accounting Automation"], "status": "GA", "description": "Modern accounting platform for startups.", "link": "https://www.puzzle.io/", "logo": ""},
    {"name": "Numeric", "category": ["Accounting Automation"], "status": "GA", "description": "Automated close and reconciliation workflows.", "link": "https://www.numeric.io/", "logo": ""},
    {"name": "Ledge", "category": ["Accounting Automation"], "status": "GA", "description": "Crypto-native finance and accounting stack.", "link": "https://www.ledge.co/", "logo": ""},
    {"name": "Trullion", "category": ["Accounting Automation"], "status": "GA", "description": "Automated lease accounting and revenue recognition.", "link": "https://www.trullion.com/", "logo": ""},
    {"name": "Doublefin", "category": ["Accounting Automation"], "status": "GA", "description": "Automated accruals and month-end workflows.", "link": "https://www.doublefin.com/", "logo": ""},
    
    # 📊 Spreadsheet & Data Manipulation
    {"name": "Google Sheets", "category": ["Data Manipulation"], "status": "GA", "description": "Cloud-based spreadsheet tool.", "link": "https://sheets.google.com/", "logo": ""},
    {"name": "Microsoft Excel", "category": ["Data Manipulation"], "status": "GA", "description": "Industry-standard spreadsheet tool.", "link": "https://www.microsoft.com/en-us/microsoft-365/excel", "logo": ""},
    {"name": "Numerous.ai", "category": ["Data Manipulation", "AI Modeling"], "status": "Beta", "description": "AI assistant for spreadsheets and data modeling.", "link": "https://www.numerous.ai/", "logo": ""},
    {"name": "Rows", "category": ["Data Manipulation"], "status": "GA", "description": "Collaborative spreadsheet platform with API integrations.", "link": "https://rows.com/", "logo": ""},
    {"name": "Alteryx", "category": ["Data Manipulation", "Automation"], "status": "GA", "description": "Drag-and-drop analytics and data blending tool.", "link": "https://www.alteryx.com/", "logo": ""},
    {"name": "Formulas HQ", "category": ["Data Manipulation"], "status": "Beta", "description": "No-code builder for spreadsheet automations.", "link": "https://www.formulashq.com/", "logo": ""},
    
    # 📈 Financial Reporting and Analysis
    {"name": "Anaplan", "category": ["Forecasting", "Reporting", "Budgeting"], "status": "GA", "description": "Enterprise planning platform for finance and operations.", "link": "https://www.anaplan.com/", "logo": ""},
    {"name": "Cube", "category": ["Reporting", "Budgeting"], "status": "GA", "description": "FP&A platform integrating with spreadsheets and ERPs.", "link": "https://www.cubesoftware.com/", "logo": ""},
    {"name": "Workday", "category": ["Reporting", "Planning"], "status": "GA", "description": "Enterprise cloud system for finance, HR, and planning.", "link": "https://www.workday.com/", "logo": ""},
    {"name": "Datarails", "category": ["Forecasting", "Reporting", "Budgeting"], "status": "GA", "description": "AI-powered FP&A platform with automation and scenario modeling.", "link": "https://www.datarails.com", "logo": ""},
    {"name": "Planful", "category": ["Planning", "Forecasting"], "status": "GA", "description": "Continuous planning platform for FP&A teams.", "link": "https://www.planful.com/", "logo": ""},
    {"name": "Oracle Hyperion", "category": ["Planning", "Reporting"], "status": "GA", "description": "Enterprise-level performance management suite.", "link": "https://www.oracle.com/epm/hyperion/", "logo": ""},
    
    # 🤖 AI and Machine Learning Models
    {"name": "Copilot", "category": ["AI Modeling"], "status": "GA", "description": "GitHub Copilot – AI pair programmer powered by OpenAI.", "link": "https://github.com/features/copilot", "logo": ""},
    {"name": "Gemini", "category": ["AI Modeling"], "status": "GA", "description": "Google’s next-gen AI assistant for tasks and insights.", "link": "https://deepmind.google/technologies/gemini/", "logo": ""},
    {"name": "ChatGPT", "category": ["AI Modeling", "Automation"], "status": "GA", "description": "Conversational AI by OpenAI.", "link": "https://chat.openai.com/", "logo": ""},
    {"name": "Hugging Face", "category": ["AI Modeling"], "status": "GA", "description": "Open-source hub for transformer models and AI tools.", "link": "https://huggingface.co/", "logo": ""},
    {"name": "Spindle AI", "category": ["AI Modeling"], "status": "Beta", "description": "AI-driven data modeling and forecasting.", "link": "https://www.spindleai.com/", "logo": ""},
    {"name": "Precanto", "category": ["AI Modeling", "Forecasting"], "status": "GA", "description": "AI-native financial planning & forecasting platform.", "link": "https://www.precanto.com/", "logo": ""},
    {"name": "Anthropic", "category": ["AI Modeling"], "status": "GA", "description": "AI safety and language models by Claude's creators.", "link": "https://www.anthropic.com/", "logo": ""},
    {"name": "Mistral AI", "category": ["AI Modeling"], "status": "GA", "description": "Open-weight LLMs designed for speed and performance.", "link": "https://mistral.ai/", "logo": ""},
    {"name": "Databricks", "category": ["AI Modeling", "Data Manipulation"], "status": "GA", "description": "Lakehouse platform for big data & machine learning.", "link": "https://databricks.com/", "logo": ""},
    {"name": "Microsoft Azure", "category": ["AI Modeling", "Infrastructure"], "status": "GA", "description": "Cloud platform for AI, analytics, and enterprise apps.", "link": "https://azure.microsoft.com/", "logo": ""}
]

# 🧠 Convert it to a DataFrame
tools_df = pd.DataFrame(embedded_tools_data)


# 🧭 Sidebar Filters
with st.sidebar:
    st.header("🔎 Filter Tools")
    selected_categories = st.multiselect(
        "Select Categories",
        options=list(CATEGORIES.keys()),
        default=list(CATEGORIES.keys()),
    )
    search_query = st.text_input("Search Tools", placeholder="Type name or description...")

# 🎯 Filtered Results
filtered_df = filter_by_categories(tools_df, selected_categories)
filtered_df = search_tools(filtered_df, search_query)

# 🔠 App Title
st.title("📊 AI for FP&A Landscape by Christian Martinez")
st.caption("Explore AI-powered tools supporting financial planning and analysis.")
st.markdown("---")

# 🧱 Tool Grid Display
cols = st.columns(3)

for index, row in filtered_df.iterrows():
    col = cols[index % 3]
    with col:
        with stylable_container(
            key=f"tool_card_{index}",
            css_styles="""
                {
                    border: 1px solid #eee;
                    border-radius: 10px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    background-color: #fafafa;
                    transition: 0.2s ease;
                }
                &:hover {
                    border-color: #ccc;
                    background-color: #f5f5f5;
                }
            """,
        ):
            # Tool Name & Link
            st.markdown(f"### [{row['name']}]({row['link']})")

            # Description
            st.write(row["description"])

            # Tags
            for cat in row["category"]:
                icon = ICON_MAP.get(cat, "")
                color = TAG_COLORS.get(cat, "#e0e0e0")
                render_tag(f"{icon} {cat}", color=color)

            # Status (text-only)
            st.markdown(
                f"<span style='font-size: 0.85rem; color: gray;'>Status: {row['status']}</span>",
                unsafe_allow_html=True
            )

            # Optional Logo
            if row.get("logo"):
                st.image(row["logo"], width=100)
