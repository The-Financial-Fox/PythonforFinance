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

