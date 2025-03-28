# app.py

import streamlit as st
from streamlit_extras.stylable_container import stylable_container
from utils.filters import load_tools_from_json, filter_by_categories, search_tools
from config import CATEGORIES, ICON_MAP, TAG_COLORS

st.set_page_config(page_title="AI for FP&A Landscape", layout="wide")

# 🔖 Helper to render custom tags
def render_tag(label, color="lightgray"):
    st.markdown(
        f"<span style='background-color:{color};padding:4px 8px;border-radius:6px;"
        f"font-size:0.85rem;color:#333;margin-right:4px;'>{label}</span>",
        unsafe_allow_html=True
    )

# 📥 Load tools data
tools_df = load_tools_from_json("data/tools.json")

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
st.title("📊 AI for FP&A Landscape")
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
