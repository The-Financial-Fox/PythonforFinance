# app.py

import streamlit as st
from streamlit_extras.tag import tag
from streamlit_extras.stylable_container import stylable_container
from utils.filters import load_tools_from_json, filter_by_categories, search_tools
from config import CATEGORIES, ICON_MAP

st.set_page_config(page_title="AI for FP&A Landscape", layout="wide")

# Load data
tools_df = load_tools_from_json("data/tools.json")

# --- Sidebar Filters ---
with st.sidebar:
    st.header("🔎 Filter Tools")
    selected_categories = st.multiselect(
        "Select Categories",
        options=list(CATEGORIES.keys()),
        default=list(CATEGORIES.keys()),
    )

    search_query = st.text_input("Search Tools", placeholder="Type name or description...")

# --- Apply Filters ---
filtered_df = filter_by_categories(tools_df, selected_categories)
filtered_df = search_tools(filtered_df, search_query)

# --- Main Layout ---
st.title("📊 AI for FP&A Landscape")
st.caption("Explore AI-powered tools supporting financial planning and analysis.")
st.markdown("---")

# --- Grid Display ---
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
            # Tool Name
            st.markdown(f"### [{row['name']}]({row['link']})")

            # Description
            st.write(row["description"])

            # Tags
            for cat in row["category"]:
                tag(label=f"{ICON_MAP.get(cat, '')} {cat}", color=CATEGORIES.get(cat, "gray"))

            # Status
            st.markdown(f"<span style='font-size: 0.85rem; color: gray;'>Status: {row['status']}</span>", unsafe_allow_html=True)

            # Optional Logo
            if row.get("logo"):
                st.image(row["logo"], width=100)

