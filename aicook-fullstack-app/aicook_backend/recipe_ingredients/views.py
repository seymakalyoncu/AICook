from rest_framework import viewsets
from .models import RecipeIngredients
from .serializers import RecipeIngredientsSerializer

class RecipeIngredientsController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder

    queryset = RecipeIngredients.objects.all()
    serializer_class = RecipeIngredientsSerializer