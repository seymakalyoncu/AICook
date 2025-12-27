import numpy as np
from datetime import datetime

# RECIPE + GEÇMİŞ DAVRANIŞ → FEATURE
def extract_features(recipe, user_histories, user_favorites):

    cooked_count = sum(1 for h in user_histories if h.recipe_id == recipe.id)
    ratings = [h.rating for h in user_histories if h.recipe_id == recipe.id]
    avg_rating = np.mean(ratings) if ratings else 0

    last_cooked = [h.cooked_date for h in user_histories if h.recipe_id == recipe.id]
    if last_cooked:
        last_dates = [d.date() if isinstance(d, datetime) else d for d in last_cooked]
        days_ago = (datetime.now().date() - max(last_dates)).days
    else:
        days_ago = 999

    is_favorite = 1 if recipe.id in user_favorites else 0

    return np.array([cooked_count, avg_rating, days_ago, is_favorite])
