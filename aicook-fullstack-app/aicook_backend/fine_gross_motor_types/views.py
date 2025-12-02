from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import FineGrossMotorType
from .serializers import FineGrossMotorTypeSerializer

class FineGrossMotorTypeController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder
    
    queryset = FineGrossMotorType.objects.all()
    serializer_class = FineGrossMotorTypeSerializer

    @action(detail=False, methods=['get'], url_path='by-motor_development_type/(?P<motor_development_types_id>[^/.]+)')
    def by_motor_development_type(self, request, motor_development_types_id=None):
        FineGrossMotor = FineGrossMotorType.objects.order_by("name").filter(motor_development_types_id=motor_development_types_id)
        serializer = self.get_serializer(FineGrossMotor, many=True)
        return Response(serializer.data)