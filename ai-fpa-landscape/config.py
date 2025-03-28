# config.py

# Define the categories for tools in the landscape
CATEGORIES = {
    "Forecasting": "green",
    "Automation": "blue",
    "Reporting": "purple",
    "Planning": "orange",
    "Scenario Modeling": "red",
    "Integration": "yellow",
    "Budgeting": "cyan",
    "Visualization": "pink",
    "Other": "gray"
}

# Define statuses for tools (e.g., GA, Beta)
STATUS = {
    "GA": "green",
    "Beta": "yellow",
    "Open Source": "blue",
    "Prototype": "red",
}

# Tag colors for UI
TAG_COLORS = {
    "Forecasting": "#DFF3E3",       # light mint
    "Automation": "#E3F2FD",        # soft blue
    "Reporting": "#EBDCF3",         # pastel lavender
    "Planning": "#FFEFD6",          # soft orange
    "Scenario Modeling": "#FEE2E2", # blush red
    "Integration": "#FFF6BF",       # light yellow
    "Budgeting": "#D0F0C0",         # mint green
    "Visualization": "#FDEEF4",     # baby pink
    "Other": "#E5E5E5"              # soft gray
}


# Define default tags for the landscape
DEFAULT_TAGS = [
    "Forecasting", "Automation", "Reporting", "Planning", 
    "Scenario Modeling", "Integration", "Budgeting", "Visualization", "Other"
]

# Streamlit Extras Configurations (e.g., icons, extra widgets)
EXTRA_CONFIG = {
    "show_search": True,
    "show_category_filter": True,
    "show_tags_filter": True
}

# Add icons, logo colors, etc. if needed for Streamlit Extras or visuals
ICON_MAP = {
    "Forecasting": "📊",
    "Automation": "🤖",
    "Reporting": "📈",
    "Planning": "🗓️",
    "Scenario Modeling": "🔮",
    "Integration": "🔗",
    "Budgeting": "💰",
    "Visualization": "📊",
    "Other": "🛠️"
}

