from rest_framework import viewsets
from .models import Ingredients
from .serializers import IngredientsSerializer

class IngredientsController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder

    queryset = Ingredients.objects.all()
    serializer_class = IngredientsSerializer