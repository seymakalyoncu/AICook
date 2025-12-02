from rest_framework import serializers
from .models import PhysicalDevelopmentRecord

class PhysicalDevelopmentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhysicalDevelopmentRecord
        fields = '__all__'