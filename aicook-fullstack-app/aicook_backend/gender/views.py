from rest_framework import viewsets
from .models import Gender
from .serializers import GenderSerializer

class GenderController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder

    queryset = Gender.objects.all()
    serializer_class = GenderSerializer