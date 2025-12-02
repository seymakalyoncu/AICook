import joblib
from django.core.management.base import BaseCommand
from ml_engine.writing_prediction_engine import (
    train_writing_prediction_model,
    train_writing_time_regressor,
    predict_child_writing_ability
)

class Command(BaseCommand):
    help = 'Yazma tahmin modellerini eğitir, diske kaydeder ve test tahmini yapar'

    def add_arguments(self, parser):
        parser.add_argument('--child_id', type=int, help='Tahmin yapılacak çocuk ID')

    def handle(self, *args, **options):
        self.stdout.write("Model eğitiliyor...")

        clf = train_writing_prediction_model()
        joblib.dump(clf, 'ml_engine/models/writing_classifier.joblib')

        reg = train_writing_time_regressor()
        joblib.dump(reg, 'ml_engine/models/writing_regressor.joblib')

        self.stdout.write("Modeller kaydedildi.")

        # Opsiyonel tahmin
        child_id = options.get('child_id')
        if child_id:
            self.stdout.write(f"\nTahmin yapılıyor: child_id={child_id}")
            result = predict_child_writing_ability(child_id, clf, reg)
            self.stdout.write(f"Tahmin Sonucu: {result}")
