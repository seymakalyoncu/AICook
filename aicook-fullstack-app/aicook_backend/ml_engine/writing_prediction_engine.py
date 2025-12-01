import pandas as pd
import numpy as np
from datetime import timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from motor_development_records.models import MotorDevelopmentRecord
from fine_gross_motor_types.models import FineGrossMotorType
from children.models import Child

def predict_child_writing_ability(child_id: int):
    target_skill = FineGrossMotorType.objects.get(name="Yazı yazma, çizim yapma")

    all_records = MotorDevelopmentRecord.objects.select_related('child', 'fine_gross_motor_type').filter(development_state_id=1)
    children = Child.objects.all()

    data = []
    for child in children:
        child_records = [r for r in all_records if r.child_id == child.id]
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

    if train_df.empty:
        raise ValueError("Yeterli etiketli veri yok, model eğitilemedi.")

    X = train_df.drop(columns=['child_id', 'birth_date', 'writing_success_days'])
    y = train_df['writing_success_days']

    imputer = SimpleImputer(strategy='mean')
    X_imputed = imputer.fit_transform(X)

    rf_model = RandomForestRegressor(
        n_estimators=300,
        max_depth=15,
        min_samples_leaf=2,
        min_samples_split=5,
        random_state=40
    )
    rf_model.fit(X_imputed, y)

    # Tek çocuğun tahmini
    child_row = df[df['child_id'] == child_id]
    if child_row.empty:
        raise ValueError(f"Çocuk ID {child_id} için kayıt bulunamadı.")

    X_child = imputer.transform(child_row.drop(columns=['child_id', 'birth_date', 'writing_success_days']))
    predicted_days = rf_model.predict(X_child)[0]
    predicted_date = child_row.iloc[0]['birth_date'] + timedelta(days=int(predicted_days))

    real_days = child_row.iloc[0]['writing_success_days']
    real_date = None
    if real_days and real_days > 0:
        real_date = child_row.iloc[0]['birth_date'] + timedelta(days=int(real_days))

    diff = (real_date - predicted_date).days if real_date else None

    return {
        "child_id": child_id,
        "predicted_date": predicted_date.strftime("%Y-%m-%d"),
        "real_date": real_date.strftime("%Y-%m-%d") if real_date else None,
        "difference_days": diff if diff is not None else "Gerçek tarih yok"
    }
