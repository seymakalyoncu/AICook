from rest_framework import serializers
from .models import EmotionalDevelopmentRecord

class EmotionalDevelopmentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmotionalDevelopmentRecord
        fields = '__all__'