from rest_framework import serializers
from .models import FineGrossMotorType

class FineGrossMotorTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FineGrossMotorType
        fields = '__all__'