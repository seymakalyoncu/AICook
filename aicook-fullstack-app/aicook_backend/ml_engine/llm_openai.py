import openai
from datetime import datetime, timedelta
from django.conf import settings
from meal_records.models import MealRecord  # modelin doğru import edildiğinden emin ol
from django.utils.timezone import now

openai.api_key = settings.OPENAI_API_KEY

def get_season(month):
    if month in [12, 1, 2]:
        return "kış"
    elif month in [3, 4, 5]:
        return "ilkbahar"
    elif month in [6, 7, 8]:
        return "yaz"
    else:
        return "sonbahar"

def fetch_meal_records(child_id):
    today = now()
    start_date = today - timedelta(days=30)

    records = MealRecord.objects.filter(child_id=child_id, meal_datetime__gte=start_date).select_related('meal_type').order_by('meal_datetime')

    meal_list = []
    for r in records:
        meal_list.append({
            "date": r.meal_datetime.strftime("%Y-%m-%d"),
            "meal_name": r.meal_name,
            "meal_type": r.meal_type.name,
            "comment": r.comment or ""
        })

    return meal_list

def create_meal_recommendation_prompt(meal_records, season):
    prompt = f"""
Aşağıda bir çocuğun son 30 gün içerisindeki yemek kayıtları bulunmaktadır:
"""

    for mr in meal_records:
        prompt += f"- Tarih: {mr['date']}, Yemek: {mr['meal_name']}, Yorum: {mr['comment']}\n"

    prompt += f"""
Bu bilgilere dayanarak, {season} mevsiminde çocuğun sevdiği yemeklere ve mevcut verilere göre ona uygun **bir günlük kısa yemek önerisi** yap. 

Lütfen öneriyi 2-3 cümleyle sınırla. Yeni tatlar için sadece 1 küçük ipucu ver.
"""
    return prompt

def generate_meal_recommendation(child_id):
    meal_records = fetch_meal_records(child_id)
    if not meal_records:
        return "Yemek verisi bulunamadı, öneri yapılamıyor."

    today = datetime.today()
    season = get_season(today.month)

    prompt = create_meal_recommendation_prompt(meal_records, season)

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Sen beslenme ve çocuk gelişimi konusunda uzman bir asistansın."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.2,
            n=1,
            stop=None,
        )
        choices = response.choices[0]
        recommendation = choices.message.content
        if choices.finish_reason == "length":
            recommendation += "\n(Uyarı: Yanıt token sınırına ulaştığı için eksik olabilir.)"

        return recommendation
    except Exception as e:
        return f"OpenAI API çağrısında hata: {str(e)}"
