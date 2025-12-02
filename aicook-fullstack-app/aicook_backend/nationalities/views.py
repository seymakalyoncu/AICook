from rest_framework import viewsets
from .models import Nationality
from .serializers import NationalitySerializer

class NationalityController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder
    queryset = Nationality.objects.order_by('name').all()
    serializer_class = NationalitySerializer