from fridge_photos.yolo.detect import detect_ingredients
from .s3_service import generate_presigned_url
import tempfile
import requests

def analyze_photo(s3_url):
    signed_url = generate_presigned_url(s3_url)

    response = requests.get(signed_url)
    response.raise_for_status()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(response.content)
        temp_path = tmp.name

    return detect_ingredients(temp_path)
