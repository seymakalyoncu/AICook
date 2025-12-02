from rest_framework import serializers
from .models import ProgressReport

class ProgressReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressReport
        fields = '__all__'