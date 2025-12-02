from rest_framework import viewsets
from .models import ProgressReport
from .serializers import ProgressReportSerializer

class ProgressReportController(viewsets.ModelViewSet):
    queryset = ProgressReport.objects.all()
    serializer_class = ProgressReportSerializer