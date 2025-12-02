from .percentile_data import PERCENTILES_HEIGHT, PERCENTILE_WEIGHT

def calculate_percentile(data_type: str, gender: str, age_months: int, value: float) -> str:
    if data_type == "height":
        percentiles = PERCENTILES_HEIGHT
    elif data_type == "weight":
        percentiles = PERCENTILE_WEIGHT
    else:
        raise ValueError("data_type 'height' ya da 'weight' olmalı.")

    if gender not in percentiles:
        raise ValueError("Cinsiyet 'Erkek' ya da 'Kadın' olmalı.")

    if age_months not in percentiles[gender]:
        return (
            "Percentile hesaplaması yalnızca 0-36 ay arası çocuklar için geçerlidir. "
            "Çocuğunuzun yaşı bu aralığın dışındadır, bu nedenle percentile değerlendirmesi yapılamamaktadır."
        )

    thresholds = percentiles[gender][age_months]
    p3 = thresholds["P3"]
    p50 = thresholds["P50"]
    p97 = thresholds["P97"]

    if value < p3:
        return (
            f"Ölçülen değer, yaşına ve cinsiyetine göre %3 altındaki çocuklarla "
            "uygunluk gösteriyor. Bu durum, büyüme eğrisinde önemli bir gerilik olduğunu "
            "ve çocuğunuzun sağlık takibinin dikkatle yapılması gerektiğini gösterebilir. "
            "Doktorunuza danışmanız faydalı olacaktır."
        )
    elif p3 <= value < p50:
        return (
            "Ölçülen değer, yaşına ve cinsiyetine göre %3 ile %50 arasında yer almaktadır. "
            "Bu, çocuğunuzun büyümesinin genel popülasyonun alt yarısında olduğunu, ancak "
            "hala normal kabul edilen sınırlar içinde olduğunu gösterir. Düzenli takip önemlidir."
        )
    elif p50 <= value < p97:
        return (
            "Ölçülen değer, yaşına ve cinsiyetine göre %50 ile %97 arasında yer almaktadır. "
            "Bu, çocuğunuzun büyüme parametrelerinin ortalamanın üzerinde olduğunu gösterir "
            "ve sağlıklı bir gelişim olduğunu işaret eder."
        )
    else:
        return (
            "Ölçülen değer, yaşına ve cinsiyetine göre %97'nin üzerinde yer almaktadır. "
            "Bu durum, büyüme eğrisinde normalin üzerinde bir gelişim olduğunu gösterir. "
            "Sağlık durumu açısından doktorunuzun görüşünü almak faydalı olacaktır."
        )
