from rest_framework import viewsets
from .models import SuggestionWarningState
from .serializers import SuggestionWarningStateSerializer

class SuggestionWarningStateController(viewsets.ModelViewSet):
    queryset = SuggestionWarningState.objects.all()
    serializer_class = SuggestionWarningStateSerializer