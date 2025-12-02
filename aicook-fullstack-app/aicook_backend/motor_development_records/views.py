from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import MotorDevelopmentRecord
from .serializers import MotorDevelopmentRecordSerializer

class MotorDevelopmentRecordController(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = MotorDevelopmentRecord.objects.all()
    serializer_class = MotorDevelopmentRecordSerializer

    def get_queryset(self):
        queryset = MotorDevelopmentRecord.objects.all()
        child_id = self.request.query_params.get('child')

        if child_id:
            queryset = queryset.filter(child=child_id)

        return queryset