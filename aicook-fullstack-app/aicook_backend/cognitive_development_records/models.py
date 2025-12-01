from django.db import models
from children.models import Child
from cognitive_development_types.models import CognitiveDevelopmentType
from development_states.models import DevelopmentState

# Create your models here.

class CognitiveDevelopmentRecord(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    child = models.ForeignKey(Child, models.DO_NOTHING, db_column='Child_Id')  # Field name made lowercase.
    cognitive_development_type = models.ForeignKey(CognitiveDevelopmentType, models.DO_NOTHING, db_column='Cognitive_Development_Type')  # Field name made lowercase.
    development_state = models.ForeignKey(DevelopmentState, models.DO_NOTHING, db_column='Development_State')  # Field name made lowercase.
    observation = models.CharField(db_column='Observation', max_length=250, blank=True, null=True)  # Field name made lowercase.
    observation_datetime = models.DateTimeField(db_column='Observation_Datetime')  # Field name made lowercase.
    comment = models.TextField(db_column='Comment', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Cognitive_Development_Records'
        db_table_comment = 'Bilişsel Gelişim Kayıtları'