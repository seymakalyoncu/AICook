from rest_framework import serializers
from .models import CookingAreaType

class CookingAreaTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CookingAreaType
        fields = '__all__'