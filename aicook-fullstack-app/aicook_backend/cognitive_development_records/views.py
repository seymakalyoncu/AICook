from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import CognitiveDevelopmentRecord
from .serializers import CognitiveDevelopmentRecordSerializer

class CognitiveDevelopmentRecordController(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = CognitiveDevelopmentRecord.objects.all()
    serializer_class = CognitiveDevelopmentRecordSerializer

    def get_queryset(self):
        queryset = CognitiveDevelopmentRecord.objects.all()
        child_id = self.request.query_params.get('child')

        if child_id:
            queryset = queryset.filter(child=child_id)

        return queryset