from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import City
from .serializers import CitySerializer

class CityController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder

    queryset = City.objects.order_by("name").all()
    serializer_class = CitySerializer