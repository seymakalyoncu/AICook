from rest_framework import viewsets
from .models import SleepQualityState
from .serializers import SleepQualityStateSerializer

class SleepQualityStateController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder

    queryset = SleepQualityState.objects.all()
    serializer_class = SleepQualityStateSerializer