# örnek: ml_engine/management/commands/analyze_writing.py

from django.core.management.base import BaseCommand
from ml_engine.analyze_all_children import analyze_all_children  # Modül yolunu senin yapına göre ayarla

class Command(BaseCommand):
    help = "Çocukların yazı yazma gelişimini analiz eder ve tahmin yapar."

    def handle(self, *args, **kwargs):
        df = analyze_all_children()
        self.stdout.write(self.style.SUCCESS("Analiz tamamlandı."))
        self.stdout.write(self.style.SUCCESS(f"{len(df)} çocuk analiz edildi. Tahminler yazıldı."))
