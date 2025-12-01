from django.db import models
from children.models import Child
from daily_event_types.models import DailyEventType

# Create your models here.

class DailyEventRecord(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    child = models.ForeignKey(Child, models.DO_NOTHING, db_column='Child_Id')  # Field name made lowercase.
    daily_event_type = models.ForeignKey(DailyEventType, models.DO_NOTHING, db_column='Daily_Event_Type')  # Field name made lowercase.
    comment = models.TextField(db_column='Comment', blank=True, null=True)  # Field name made lowercase.
    event_datetime = models.DateTimeField(db_column='Event_Datetime')  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Daily_Event_Records'
        db_table_comment = 'Günlük Olay Kayıtları'