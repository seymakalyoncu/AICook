from recipes.models import Recipes
from meal_histories.models import MealHistories
from favorite_recipes.models import FavoriteRecipes

from .build_dataset import build_user_dataset
from .train_rf import train_model
from .utils import get_unique_day_count, REQUIRED_DAY_COUNT

def get_daily_recommendation(user):
    meal_histories = MealHistories.objects.filter(user=user)
    favorites = list(FavoriteRecipes.objects.filter(user=user, active=True).values_list("recipe_id", flat=True))

    unique_day_count = get_unique_day_count(meal_histories)
    if unique_day_count < REQUIRED_DAY_COUNT:
        return {
            "not_enough_data": True,
            "unique_day_count": unique_day_count,
            "required_day_count": REQUIRED_DAY_COUNT,
            "message": f"Öneri için en az {REQUIRED_DAY_COUNT} farklı gün yemek kaydı gereklidir."
        }

    recipes = Recipes.objects.all()
    df = build_user_dataset(recipes, meal_histories, favorites, exclude_last_days=2)

    if df.empty:
        return {
            "not_enough_data": False,
            "unique_day_count": unique_day_count,
            "recommendations": []
        }

    X = df[["cooked_count", "avg_rating", "last_cooked_days_ago", "is_favorite"]].values
    y = df["target"].values
    recipe_ids = df["recipe_id"].values

    model = train_model(X, y)

    recommendations = []
    for recipe_id, features in zip(recipe_ids, X):
        pred = model.predict([features])[0]
        # favori değilse veya target 0 ise önerme
        if pred > 0.5 and recipe_id in favorites:
            recipe = Recipes.objects.get(id=recipe_id)
            recommendations.append({
                "recipe_id": recipe.id,
                "recipe_name": recipe.recipe
            })

    return {
        "not_enough_data": False,
        "unique_day_count": unique_day_count,
        "recommendations": recommendations
    }
