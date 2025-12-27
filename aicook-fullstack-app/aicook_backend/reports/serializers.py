from rest_framework import serializers
from .models import (HistoryCategory, HistoryDate, HistoryIngredient, HistoryRating)

class HistoryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryCategory
        fields = '__all__'

class HistoryDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryDate
        fields = '__all__'

class HistoryIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryIngredient
        fields = '__all__'

class HistoryRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryRating
        fields = '__all__'
