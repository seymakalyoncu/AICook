from rest_framework import viewsets
from .models import MealTime
from .serializers import MealTimeSerializer

class MealTimeController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder

    queryset = MealTime.objects.all()
    serializer_class = MealTimeSerializer