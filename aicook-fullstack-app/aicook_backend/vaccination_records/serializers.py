from rest_framework import serializers
from .models import VaccinationRecord

class VaccinationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccinationRecord
        fields = '__all__'