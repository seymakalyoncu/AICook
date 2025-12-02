from rest_framework import serializers
from .models import (
    PhysicalDevelopmentView,
    TotalSleepView,
    TotalMealNutritiveView,
)

class PhysicalDevelopmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhysicalDevelopmentView
        fields = '__all__'

class TotalSleepSerializer(serializers.ModelSerializer):
    class Meta:
        model = TotalSleepView
        fields = '__all__'

class TotalMealNutritiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = TotalMealNutritiveView
        fields = '__all__'
