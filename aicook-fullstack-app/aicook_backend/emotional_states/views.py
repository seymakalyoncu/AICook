from rest_framework import viewsets
from .models import EmotionalState
from .serializers import EmotionalStateSerializer

class EmotionalStateController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder

    queryset = EmotionalState.objects.all()
    serializer_class = EmotionalStateSerializer