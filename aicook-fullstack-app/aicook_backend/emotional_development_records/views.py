from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import EmotionalDevelopmentRecord
from .serializers import EmotionalDevelopmentRecordSerializer

class EmotionalDevelopmentRecordController(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = EmotionalDevelopmentRecord.objects.all()
    serializer_class = EmotionalDevelopmentRecordSerializer

    def get_queryset(self):
        queryset = EmotionalDevelopmentRecord.objects.all()
        child_id = self.request.query_params.get('child')

        if child_id:
            queryset = queryset.filter(child=child_id)

        return queryset