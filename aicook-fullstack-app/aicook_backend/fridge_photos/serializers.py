from rest_framework import serializers
from .models import FridgePhotos

class FridgePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FridgePhotos
        fields = '__all__'
