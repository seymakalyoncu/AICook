from rest_framework import viewsets
from .models import MotorDevelopmentType
from .serializers import MotorDevelopmentTypeSerializer

class MotorDevelopmentTypeController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder
    
    queryset = MotorDevelopmentType.objects.all()
    serializer_class = MotorDevelopmentTypeSerializer