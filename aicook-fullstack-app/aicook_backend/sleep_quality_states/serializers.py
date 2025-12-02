from rest_framework import serializers
from .models import SleepQualityState

class SleepQualityStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SleepQualityState
        fields = '__all__'