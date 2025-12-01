from rest_framework import viewsets
from .models import EducationState
from .serializers import EducationStateSerializer

class EducationStateController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder

    queryset = EducationState.objects.all()
    serializer_class = EducationStateSerializer