from rest_framework import serializers
from .models import MealTime

class MealTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealTime
        fields = '__all__'