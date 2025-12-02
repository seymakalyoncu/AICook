from rest_framework import viewsets
from .models import ReportType
from .serializers import ReportTypeSerializer

class ReportTypeController(viewsets.ModelViewSet):
    queryset = ReportType.objects.all()
    serializer_class = ReportTypeSerializer