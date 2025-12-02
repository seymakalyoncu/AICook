from rest_framework import serializers
from .models import CognitiveDevelopmentRecord

class CognitiveDevelopmentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CognitiveDevelopmentRecord
        fields = '__all__'