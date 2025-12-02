from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import PhysicalDevelopmentRecord
from .serializers import PhysicalDevelopmentRecordSerializer

class PhysicalDevelopmentRecordController(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = PhysicalDevelopmentRecord.objects.all()
    serializer_class = PhysicalDevelopmentRecordSerializer

    def get_queryset(self):
        queryset = PhysicalDevelopmentRecord.objects.all()
        child_id = self.request.query_params.get('child')

        if child_id:
            queryset = queryset.filter(child=child_id)

        return queryset