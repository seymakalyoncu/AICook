from rest_framework import serializers
from .models import BabysitterRole

class BabysitterRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = BabysitterRole
        fields = '__all__'