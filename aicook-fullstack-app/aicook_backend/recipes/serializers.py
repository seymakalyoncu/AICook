from rest_framework import serializers
from .models import Recipes

class RecipeSearchSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    time_type_name = serializers.CharField(source="time_type.name", read_only=True)
    cooking_area_name = serializers.CharField(source="cooking_area_type.name", read_only=True)

    class Meta:
        model = Recipes
        fields = [
            "id",
            "recipe", 
            "description",        
            "servings",
            "cooking_time",
            "time_type_name",
            "category_name",
            "cooking_area_name",
        ]
