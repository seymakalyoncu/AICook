from rest_framework import serializers
from .models import DiseaseType

class DiseaseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiseaseType
        fields = '__all__'