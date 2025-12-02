from rest_framework import serializers
from .models import ReportType

class ReportTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportType
        fields = '__all__'