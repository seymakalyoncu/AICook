from django.db import models
from children.models import Child
from disease_types.models import DiseaseType

# Create your models here.

class HealthRecord(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    child = models.ForeignKey(Child, models.DO_NOTHING, db_column='Child_Id')  # Field name made lowercase.
    disease_type = models.ForeignKey(DiseaseType, models.DO_NOTHING, db_column='Disease_Type')  # Field name made lowercase.
    disease_name = models.CharField(db_column='Disease_Name', max_length=250)  # Field name made lowercase.
    disease_datetime = models.DateTimeField(db_column='Disease_Datetime')  # Field name made lowercase.
    disease_treatment = models.CharField(db_column='Disease_Treatment', max_length=250, blank=True, null=True)  # Field name made lowercase.
    doctor_name = models.CharField(db_column='Doctor_Name', max_length=500, blank=True, null=True)  # Field name made lowercase.
    medicine = models.CharField(db_column='Medicine', max_length=250, blank=True, null=True)  # Field name made lowercase.
    comment = models.TextField(db_column='Comment', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Health_Records'
        db_table_comment = 'Hastalık Kayıtları'