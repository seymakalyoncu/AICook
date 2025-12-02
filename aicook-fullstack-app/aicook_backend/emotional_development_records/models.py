from django.db import models
from children.models import Child
from development_states.models import DevelopmentState
from emotional_states.models import EmotionalState

# Create your models here.

class EmotionalDevelopmentRecord(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    child = models.ForeignKey(Child, models.DO_NOTHING, db_column='Child_Id')  # Field name made lowercase.
    emotional_state = models.ForeignKey(EmotionalState, models.DO_NOTHING, db_column='Emotional_State')  # Field name made lowercase.
    social_interaction = models.CharField(db_column='Social_Interaction', max_length=250)  # Field name made lowercase.
    development_state = models.ForeignKey(DevelopmentState, models.DO_NOTHING, db_column='Development_State')  # Field name made lowercase.
    observation = models.CharField(db_column='Observation', max_length=250)  # Field name made lowercase.
    observation_datetime = models.DateTimeField(db_column='Observation_Datetime')  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    comment = models.TextField(db_column='Comment', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Emotional_Development_Records'
        db_table_comment = 'Duygusal Gelişim Kayıtları'