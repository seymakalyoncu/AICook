from django.db import models
from children.models import Child
from vaccines.models import Vaccine

# Create your models here.

class VaccinationRecord(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    child = models.ForeignKey(Child, models.DO_NOTHING, db_column='Child_Id')  # Field name made lowercase.
    vaccine = models.ForeignKey(Vaccine, models.DO_NOTHING, db_column='Vaccine')  # Field name made lowercase.
    vaccine_datetime = models.DateTimeField(db_column='Vaccine_Datetime')  # Field name made lowercase.
    doctor_name = models.CharField(db_column='Doctor_Name', max_length=500, blank=True, null=True)  # Field name made lowercase.
    comment = models.TextField(db_column='Comment', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Vaccination_Records'
        db_table_comment = 'Aşı Kayıtları'