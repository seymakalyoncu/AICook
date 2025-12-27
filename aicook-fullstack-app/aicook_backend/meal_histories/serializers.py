from rest_framework import serializers
from .models import MealHistories

class MealHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MealHistories
        fields = '__all__'
