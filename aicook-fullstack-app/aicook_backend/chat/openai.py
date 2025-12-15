from openai import OpenAI
from django.conf import settings

SYSTEM_PROMPT = """
Sen yalnızca yemek, tarif ve beslenme konularında uzman bir asistansın.

Sadece şu konulara cevap verebilirsin:
- Yemek tarifleri
- Besinler ve besin değerleri
- Öğün planlama
- Pişirme yöntemleri
- Gıda ve mutfak

Bu konuların dışında kalan her soruya şu cevabı ver:
"Bu proje yalnızca yemek, tarif, beslenme vb. konularında yardımcı olmaktadır."

Asla başka bir konuda bilgi verme.
"""

def ask_openai(message: str) -> str:
    """
    message SADECE STRING olmalıdır.
    Dict gelmez, prompt['message'] YOK.
    """
    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": message
            }
        ],
        temperature=0.3
    )

    return completion.choices[0].message.content
