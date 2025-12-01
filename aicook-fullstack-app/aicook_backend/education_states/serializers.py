from rest_framework import serializers
from .models import EducationState

class EducationStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationState
        fields = '__all__'