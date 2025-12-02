from rest_framework import serializers
from .models import DevelopmentState

class DevelopmentStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevelopmentState
        fields = '__all__'