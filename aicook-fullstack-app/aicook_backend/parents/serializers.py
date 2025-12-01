from rest_framework import serializers
from .models import Parent

class ParentSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    
    class Meta:
        model = Parent
        fields = '__all__'