from datetime import date
from .percentile_engine import calculate_percentile 

def calculate_age(birth_date: date, measurement_datetime) -> int:
    """Doğum tarihi ve ölçüm tarihine göre yaşın ay cinsinden hesaplanması"""
    measurement_date = measurement_datetime.date()  # datetime'den sadece tarih kısmını al
    days = (measurement_date - birth_date).days
    return int(days / 30.44)  # 1 ay ≈ 30.44 gün

def analyze_child_measurement(height: float, weight: float, birth_date: date, measurement_datetime, gender: str):
    """Boy ve kilo ölçümünü analiz eder, percentile yorumları döner"""
    age_months = calculate_age(birth_date, measurement_datetime)

    height_result = calculate_percentile("height", gender, age_months, height)
    weight_result = calculate_percentile("weight", gender, age_months, weight)

    messages = [
        f"Boy: {height_result}",
        f"Kilo: {weight_result}"
    ]
    warnings = []

    if height_result == "P3 altında":
        warnings.append("Boy uzunluğu yaşına göre çok düşük, doktorunuza danışın.")
    if weight_result == "P3 altında":
        warnings.append("Kilo yaşına göre çok düşük, beslenmeye dikkat edin.")

    return {
        "age_months": age_months,
        "height_percentile": height_result,
        "weight_percentile": weight_result,
        "messages": messages,
        "warnings": warnings,
    }