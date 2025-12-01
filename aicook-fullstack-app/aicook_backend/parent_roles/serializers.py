from rest_framework import serializers
from .models import ParentRole

class ParentRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentRole
        fields = '__all__'