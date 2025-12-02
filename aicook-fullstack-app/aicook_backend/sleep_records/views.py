from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import SleepRecord
from .serializers import SleepRecordSerializer

class SleepRecordController(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = SleepRecord.objects.all()
    serializer_class = SleepRecordSerializer

    def get_queryset(self):
        queryset = SleepRecord.objects.all()
        child_id = self.request.query_params.get('child')

        if child_id:
            queryset = queryset.filter(child=child_id)

        return queryset