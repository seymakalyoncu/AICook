from rest_framework import serializers
from .models import EmotionalState

class EmotionalStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmotionalState
        fields = '__all__'