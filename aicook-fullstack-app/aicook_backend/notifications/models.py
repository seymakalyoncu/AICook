from django.db import models
from parents.models import Parent

# Create your models here.

class Notification(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    parent = models.ForeignKey(Parent, models.DO_NOTHING, db_column='Parent_Id')  # Field name made lowercase.
    text = models.TextField(db_column='Text', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate')  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Notifications'
        db_table_comment = 'Bildirimler Bilgisi'