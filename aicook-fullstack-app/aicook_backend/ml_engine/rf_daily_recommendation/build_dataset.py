import numpy as np
import pandas as pd
from datetime import date, datetime, timedelta
from .feature_extractor import extract_features

#  geçmiş veriden TRAIN datası üretmek
def build_user_dataset(recipes, meal_histories, favorite_recipe_ids, exclude_last_days=2):

    data = []
    today = date.today()
    cutoff_date = today - timedelta(days=exclude_last_days)

    history_dict = {h.recipe_id: [] for h in meal_histories}
    for h in meal_histories:
        history_dict[h.recipe_id].append(h)

    for recipe in recipes:

        cooked_dates = [h.cooked_date.date() if isinstance(h.cooked_date, datetime) else h.cooked_date
                        for h in history_dict.get(recipe.id, [])]
        if cooked_dates and max(cooked_dates) >= cutoff_date:
            continue

        cooked_count = len(history_dict.get(recipe.id, []))
        avg_rating = np.mean([h.rating for h in history_dict.get(recipe.id, [])]) if cooked_count > 0 else 0
        last_cooked_days_ago = (today - max(cooked_dates)).days if cooked_dates else -1
        is_favorite = 1 if recipe.id in favorite_recipe_ids else 0

        label = 1 if (avg_rating >= 7 and is_favorite) else 0

        row = {
            "recipe_id": recipe.id,
            "cooked_count": cooked_count,
            "is_favorite": is_favorite,
            "avg_rating": avg_rating,
            "last_cooked_days_ago": last_cooked_days_ago,
            "category_id": recipe.category_id,
            "target": label
        }
        data.append(row)

    df = pd.DataFrame(data)
    return df
