from rest_framework import serializers
from .models import CognitiveDevelopmentType

class CognitiveDevelopmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CognitiveDevelopmentType
        fields = '__all__'