from sklearn.ensemble import RandomForestRegressor

def train_model(X, y):
    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=15,       
        min_samples_leaf=2,
        random_state=44
    )
    model.fit(X, y)
    return model
