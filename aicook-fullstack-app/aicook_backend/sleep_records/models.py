from django.db import models
from children.models import Child
from sleep_quality_states.models import SleepQualityState

# Create your models here.

class SleepRecord(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    child = models.ForeignKey(Child, models.DO_NOTHING, db_column='Child_Id')  # Field name made lowercase.
    sleep_start_datetime = models.DateTimeField(db_column='Sleep_Start_Datetime')  # Field name made lowercase.
    sleep_end_datetime = models.DateTimeField(db_column='Sleep_End_Datetime')  # Field name made lowercase.
    total_time = models.IntegerField(db_column='Total_Time', blank=True, null=True)  # Field name made lowercase.
    sleep_quality = models.ForeignKey(SleepQualityState, models.DO_NOTHING, db_column='Sleep_Quality')  # Field name made lowercase.
    comment = models.TextField(db_column='Comment', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Sleep_Records'
        db_table_comment = 'Uyku Kayıtları'