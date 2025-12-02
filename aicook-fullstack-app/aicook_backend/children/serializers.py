from rest_framework import serializers
from .models import Child

class ChildSerializer(serializers.ModelSerializer):
    gender_name = serializers.CharField(source='gender.name', read_only=True)
    
    class Meta:
        model = Child
        fields = '__all__'