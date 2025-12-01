from rest_framework import serializers
from .models import DailyEventRecord

class DailyEventRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyEventRecord
        fields = '__all__'