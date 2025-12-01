from django.db import models
from motor_development_types.models import MotorDevelopmentType

# Create your models here.

class FineGrossMotorType(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=250)  # Field name made lowercase.
    motor_development_types = models.ForeignKey(MotorDevelopmentType, models.DO_NOTHING, db_column='Motor_Development_Types_Id')  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate')  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Fine_Gross_Motor_Types'
        db_table_comment = 'İnce/Kaba Motor Gelişim Türleri'