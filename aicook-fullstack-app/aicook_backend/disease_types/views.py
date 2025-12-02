from rest_framework import viewsets
from .models import DiseaseType
from .serializers import DiseaseTypeSerializer

class DiseaseTypeController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder
    
    queryset = DiseaseType.objects.all()
    serializer_class = DiseaseTypeSerializer