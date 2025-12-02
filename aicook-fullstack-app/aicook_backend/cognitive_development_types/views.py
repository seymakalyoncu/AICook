from rest_framework import viewsets
from .models import CognitiveDevelopmentType
from .serializers import CognitiveDevelopmentTypeSerializer

class CognitiveDevelopmentTypeController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder
    
    queryset = CognitiveDevelopmentType.objects.all()
    serializer_class = CognitiveDevelopmentTypeSerializer