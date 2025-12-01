from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import District
from .serializers import DistrictSerializer

class DistrictController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder

    queryset = District.objects.all()
    serializer_class = DistrictSerializer

    @action(detail=False, methods=['get'], url_path='by-city/(?P<city_id>[^/.]+)')
    def by_city(self, request, city_id=None):
        districts = District.objects.order_by("name").filter(cities_id=city_id)
        serializer = self.get_serializer(districts, many=True)
        return Response(serializer.data)