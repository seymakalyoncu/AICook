from rest_framework import serializers
from .models import SuggestionWarningState

class SuggestionWarningStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuggestionWarningState
        fields = '__all__'