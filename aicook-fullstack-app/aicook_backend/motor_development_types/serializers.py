from rest_framework import serializers
from .models import MotorDevelopmentType

class MotorDevelopmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotorDevelopmentType
        fields = '__all__'