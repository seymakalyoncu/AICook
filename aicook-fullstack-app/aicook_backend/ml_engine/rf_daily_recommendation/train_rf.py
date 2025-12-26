from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import numpy as np

def train_model(X, y):
    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=15,
        min_samples_leaf=2,
        random_state=44
    )

    model.fit(X, y)

    # 🔍 TRAIN ÜZERİNDE KONTROL (MVP için yeterli)
    preds = model.predict(X)

    print("\n--- REGRESSION METRICS ---")
    print("R2 Score:", round(r2_score(y, preds), 3))
    print("MAE:", round(mean_absolute_error(y, preds), 3))
    print("RMSE:", round(np.sqrt(mean_squared_error(y, preds)), 3))

    print("\n--- FEATURE IMPORTANCE ---")
    for name, importance in zip(
        ["cooked_count", "avg_rating", "last_cooked_days_ago", "is_favorite"],
        model.feature_importances_
    ):
        print(f"{name}: {importance:.3f}")

    return model
