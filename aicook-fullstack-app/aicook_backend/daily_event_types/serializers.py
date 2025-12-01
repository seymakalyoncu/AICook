from rest_framework import serializers
from .models import DailyEventType

class DailyEventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyEventType
        fields = '__all__'