import pandas as pd
import numpy as np
from datetime import timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split, LeaveOneOut
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from motor_development_records.models import MotorDevelopmentRecord
from fine_gross_motor_types.models import FineGrossMotorType
from children.models import Child


def analyze_all_children():
    target_skill = FineGrossMotorType.objects.get(name="Yazı yazma, çizim yapma")
    
    all_records = MotorDevelopmentRecord.objects.select_related('child', 'fine_gross_motor_type').all()
    children = Child.objects.all()

    data = []
    for child in children:
        child_records = [r for r in all_records if r.child_id == child.id and r.development_state_id == 1]
        
        features = {
            'child_id': child.id,
            'birth_date': child.birth_date
        }
        
        target_record = next((r for r in child_records if r.fine_gross_motor_type_id == target_skill.id), None)
        if target_record:
            delta_days = (target_record.observation_datetime.date() - child.birth_date).days
            features['writing_success_days'] = delta_days
        else:
            features['writing_success_days'] = None
        
        for rec in child_records:
            key = f"skill_{rec.fine_gross_motor_type_id}"
            features[key] = 1
        
        data.append(features)

    df = pd.DataFrame(data)
    df.fillna(0, inplace=True)

    train_df = df[df['writing_success_days'] != 0]

    X = train_df.drop(columns=['child_id', 'birth_date', 'writing_success_days'])
    y = train_df['writing_success_days']

    imputer = SimpleImputer(strategy='mean')
    X_imputed = imputer.fit_transform(X)

    # Test seti ile performans
    X_train, X_test, y_train, y_test = train_test_split(X_imputed, y, test_size=0.2, random_state=42)

    rf_model = RandomForestRegressor(
        n_estimators=300,
        max_depth=15,
        min_samples_leaf=2,
        min_samples_split=5,
        random_state=40
    )
    rf_model.fit(X_train, y_train)
    y_pred = rf_model.predict(X_test)

    mae_test = mean_absolute_error(y_test, y_pred)
    rmse_test = mean_squared_error(y_test, y_pred) ** 0.5
    r2_test = r2_score(y_test, y_pred)

    print("🔹 Test Seti Performansı:")
    print(f"MAE: {mae_test:.2f} gün")
    print(f"RMSE: {rmse_test:.2f} gün")
    print(f"R²: {r2_test:.2f}\n")

    # LOOCV Performansı
    loo = LeaveOneOut()
    model_for_loo = RandomForestRegressor(
        n_estimators=300,
        max_depth=15,
        min_samples_leaf=2,
        min_samples_split=5,
        random_state=40
    )

    mae_loo = []
    rmse_loo = []

    for train_index, test_index in loo.split(X_imputed):
        X_train_loo, X_test_loo = X_imputed[train_index], X_imputed[test_index]
        y_train_loo, y_test_loo = y.iloc[train_index], y.iloc[test_index]

        model_for_loo.fit(X_train_loo, y_train_loo)
        y_pred_loo = model_for_loo.predict(X_test_loo)

        mae_loo.append(mean_absolute_error(y_test_loo, y_pred_loo))
        rmse_loo.append(mean_squared_error(y_test_loo, y_pred_loo) ** 0.5)

    print("🔹 LOOCV Ortalama Performansı:")
    print(f"MAE: {np.mean(mae_loo):.2f} gün")
    print(f"RMSE: {np.mean(rmse_loo):.2f} gün")

    # Tahmin & Gerçek tarih karşılaştırması
    rf_model.fit(X_imputed, y)  # tüm veriyle yeniden eğit
    df['predicted_days'] = rf_model.predict(imputer.transform(df.drop(columns=['child_id', 'birth_date', 'writing_success_days'])))
    df['predicted_date'] = df.apply(
        lambda r: r['birth_date'] + timedelta(days=int(r['predicted_days'])) if r['predicted_days'] > 0 else None, axis=1
    )
    df['real_date'] = df.apply(
        lambda r: r['birth_date'] + timedelta(days=int(r['writing_success_days'])) if r['writing_success_days'] > 0 else None,
        axis=1
    )
    df['difference_days'] = df.apply(
        lambda r: (r['real_date'] - r['predicted_date']).days if r['real_date'] and r['predicted_date'] else 'null',
        axis=1
    )

    for _, row in df.iterrows():
        real_date = row['real_date'] if pd.notnull(row['real_date']) else 'null'
        pred_date = row['predicted_date'] if pd.notnull(row['predicted_date']) else 'null'
        diff = row['difference_days']
        print(f"Çocuk ID: {row['child_id']} | Gerçek Tarih: {real_date} | Tahmini Tarih: {pred_date} | Fark: {diff}")

    return df
