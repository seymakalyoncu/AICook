from rest_framework import serializers
from .models import TimeType

class TimeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeType
        fields = '__all__'