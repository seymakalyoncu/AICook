from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import HealthRecord
from .serializers import HealthRecordSerializer

class HealthRecordController(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = HealthRecord.objects.all()
    serializer_class = HealthRecordSerializer

    def get_queryset(self):
        queryset = HealthRecord.objects.all()
        child_id = self.request.query_params.get('child')

        if child_id:
            queryset = queryset.filter(child=child_id)

        return queryset