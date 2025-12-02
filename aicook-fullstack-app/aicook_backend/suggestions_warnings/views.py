from rest_framework import viewsets
from .models import SuggestionsWarning
from .serializers import SuggestionsWarningSerializer

class SuggestionsWarningController(viewsets.ModelViewSet):
    queryset = SuggestionsWarning.objects.all()
    serializer_class = SuggestionsWarningSerializer