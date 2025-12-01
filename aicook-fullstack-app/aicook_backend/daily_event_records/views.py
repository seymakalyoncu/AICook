from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import DailyEventRecord
from .serializers import DailyEventRecordSerializer

class DailyEventRecordController(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = DailyEventRecord.objects.all()
    serializer_class = DailyEventRecordSerializer

    def get_queryset(self):
        queryset = DailyEventRecord.objects.all()
        child_id = self.request.query_params.get('child')

        if child_id:
            queryset = queryset.filter(child=child_id)

        return queryset