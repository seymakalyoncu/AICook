from rest_framework import serializers
from .models import MotorDevelopmentRecord

class MotorDevelopmentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotorDevelopmentRecord
        fields = '__all__'