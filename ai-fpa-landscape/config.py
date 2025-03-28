# config.py

# Define the categories for tools in the landscape
CATEGORIES = {
    "Forecasting": "green",
    "Reporting": "purple",
    "Budgeting": "cyan",
    "Planning": "orange",
    "Scenario Modeling": "red",
    "Visualization": "pink",
    "Automation": "blue",
    "Data Manipulation": "teal",
    "Accounting Automation": "brown",
    "Scripting": "gray",
    "AI Modeling": "indigo",
    "Infrastructure": "black",
    "Other": "lightgray"
}

# Define statuses for tools (e.g., GA, Beta)
STATUS = {
    "GA": "green",
    "Beta": "yellow",
    "Open Source": "blue",
    "Prototype": "red"
}

# Pastel-friendly tag colors for UI
TAG_COLORS = {
    "Forecasting": "#DFF3E3",
    "Reporting": "#EBDCF3",
    "Budgeting": "#D0F0C0",
    "Planning": "#FFEFD6",
    "Scenario Modeling": "#FEE2E2",
    "Visualization": "#FDEEF4",
    "Automation": "#E3F2FD",
    "Data Manipulation": "#E0F7FA",
    "Accounting Automation": "#F9E0C7",
    "Scripting": "#ECECEC",
    "AI Modeling": "#E8EAF6",
    "Infrastructure": "#D7CCC8",
    "Other": "#F0F0F0"
}

# Default visible tags in the UI
DEFAULT_TAGS = list(CATEGORIES.keys())

# Streamlit extras config (toggleable)
EXTRA_CONFIG = {
    "show_search": True,
    "show_category_filter": True,
    "show_tags_filter": True
}

# Icons for categories
ICON_MAP = {
    "Forecasting": "📊",
    "Reporting": "📈",
    "Budgeting": "💰",
    "Planning": "🗓️",
    "Scenario Modeling": "🔮",
    "Visualization": "🧩",
    "Automation": "🤖",
    "Data Manipulation": "🧮",
    "Accounting Automation": "📒",
    "Scripting": "⌨️",
    "AI Modeling": "🧠",
    "Infrastructure": "☁️",
    "Other": "🛠️"
}
