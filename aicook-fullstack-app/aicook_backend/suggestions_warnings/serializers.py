from rest_framework import serializers
from .models import SuggestionsWarning

class SuggestionsWarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuggestionsWarning
        fields = '__all__'