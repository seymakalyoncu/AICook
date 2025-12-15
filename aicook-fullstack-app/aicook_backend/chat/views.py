from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .openai import ask_openai

# 🔒 TOKEN YEMEYEN ANAHTAR KELİME FİLTRESİ
FOOD_KEYWORDS = {
    "yemek", "tarif", "besin", "kalori", "protein",
    "karbonhidrat", "yağ", "vitamin",
    "kahvaltı", "öğle", "akşam",
    "çorba", "salata", "tatlı",
    "pişirme", "fırın", "ocak",
    "mutfak", "beslenme", "diyet",
    "malzeme"
}

def is_food_related(text: str) -> bool:
    if not text:
        return False

    text = text.lower()
    return any(keyword in text for keyword in FOOD_KEYWORDS)


class ChatController(ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(methods=['post'], detail=False)
    def chat(self, request):

        # 🔑 Prompt normalize (dict / string fark etmez)
        raw_prompt = request.data.get("prompt") or request.data.get("message") or ""

        if isinstance(raw_prompt, dict):
            prompt = raw_prompt.get("message", "")
        else:
            prompt = raw_prompt

        prompt = prompt.strip()

        if not prompt:
            return Response(
                {"error": "Mesaj boş olamaz."},
                status=400
            )

        # 🚫 TOKEN YEMEDEN RED
        if not is_food_related(prompt):
            return Response({
                "answer": (
                    "Bu uygulama yalnızca yemek, tarif, beslenme vb."
                    "konularda yardımcı olmaktadır."
                )
            })

        # ✅ SADECE STRING GİDER
        answer = ask_openai(prompt)
        return Response({"answer": answer})
