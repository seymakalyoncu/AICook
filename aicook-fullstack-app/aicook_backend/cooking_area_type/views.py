from rest_framework import viewsets
from .models import CookingAreaType
from .serializers import CookingAreaTypeSerializer

class CookingAreaTypeController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder

    queryset = CookingAreaType.objects.all()
    serializer_class = CookingAreaTypeSerializer