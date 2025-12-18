# serializers.py
from rest_framework import serializers
from .models import FavoriteRecipes

class FavoriteRecipesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteRecipes
        fields = '__all__'
