from rest_framework import viewsets
from .models import Vaccine
from .serializers import VaccineSerializer

class VaccineController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder
    
    queryset = Vaccine.objects.all()
    serializer_class = VaccineSerializer

    def get_queryset(self):
        queryset = Vaccine.objects.all()
        child_id = self.request.query_params.get('child')

        if child_id:
            queryset = queryset.filter(child=child_id)

        return queryset