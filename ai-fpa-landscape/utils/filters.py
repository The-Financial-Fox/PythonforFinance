# utils/filters.py

import pandas as pd


def filter_by_categories(tools_df, selected_categories):
    if not selected_categories:
        return tools_df
    return tools_df[tools_df['category'].apply(lambda cats: any(cat in selected_categories for cat in cats))]


def search_tools(tools_df, query):
    if not query:
        return tools_df
    query_lower = query.lower()
    return tools_df[
        tools_df['name'].str.lower().str.contains(query_lower) |
        tools_df['description'].str.lower().str.contains(query_lower)
    ]


def load_tools_from_json(filepath):
    df = pd.read_json(filepath)
    df['category'] = df['category'].apply(lambda x: x if isinstance(x, list) else [x])
    return df
