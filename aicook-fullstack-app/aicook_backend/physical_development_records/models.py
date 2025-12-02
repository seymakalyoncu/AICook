from django.db import models
from children.models import Child

# Create your models here.

class PhysicalDevelopmentRecord(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    child = models.ForeignKey(Child, models.DO_NOTHING, db_column='Child_Id')  # Field name made lowercase.
    height_field = models.IntegerField(db_column='Height ')  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    weight = models.IntegerField(db_column='Weight')  # Field name made lowercase.
    head_circumference = models.IntegerField(db_column='Head_Circumference', blank=True, null=True)  # Field name made lowercase.
    measurement_datetime = models.DateTimeField(db_column='Measurement_Datetime')  # Field name made lowercase.
    comment = models.TextField(db_column='Comment', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Physical_Development_Records'
        db_table_comment = 'Fiziksel Gelişim Kayıtları'