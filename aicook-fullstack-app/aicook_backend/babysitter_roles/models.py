from django.db import models
from babysitters.models import Babysitter
from roles.models import Role

# Create your models here.

class BabysitterRole(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    babysitter = models.ForeignKey(Babysitter, models.DO_NOTHING, db_column='Babysitter_Id')  # Field name made lowercase.
    role = models.ForeignKey(Role, models.DO_NOTHING, db_column='Role_Id')  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate')  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Babysitter_Roles'
        db_table_comment = 'Bakıcı Rolleri'