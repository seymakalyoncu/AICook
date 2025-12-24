# detect.py
from .model import model
from ingredients.models import Ingredients

CONFIDENCE_THRESHOLD = 0.3  # minimum confidence seviyesi

def detect_ingredients(image_path):
    """
    Verilen image_path için YOLO ile tespit edilen malzemeleri Ingredients tablosu ile eşleştirir.
    Returns:
        detections: list of dict -> [{"id": int, "name": str, "confidence": float}, ...]
    """
    results = model(image_path)
    detections = []
    seen = set()  # (yolo_name, ingredient.id) çiftlerini tutar, tekrar eklemeyi önler

    for r in results:
        for box in r.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            yolo_name = model.names[class_id].lower()  # küçük harfe çevir, eşleşmede kolaylık

            print(yolo_name, confidence)
            if confidence < CONFIDENCE_THRESHOLD:
                continue

            # DB'de yolo_key ile eşleşen tüm ingredientleri al (case-insensitive)
            ingredients_qs = Ingredients.objects.filter(yolo_key__iexact=yolo_name)

            for ingredient in ingredients_qs:
                key = (yolo_name, ingredient.id)
                if key in seen:
                    continue

                seen.add(key)
                detections.append({
                    "id": ingredient.id,
                    "name": ingredient.name,
                    "confidence": round(confidence, 2)
                })

    return detections
