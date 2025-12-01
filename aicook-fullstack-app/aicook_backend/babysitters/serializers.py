from rest_framework import serializers
from .models import Babysitter

class BabysitterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Babysitter
        fields = '__all__'