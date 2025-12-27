from rest_framework import viewsets
from .models import Categories
from .serializers import CategoriesSerializer

class CategoriesController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder

    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer