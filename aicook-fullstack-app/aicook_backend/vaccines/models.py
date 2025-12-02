from django.db import models

# Create your models here.

class Vaccine(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=250)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate')  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Vaccines'
        db_table_comment = 'Aşılar Bilgisi'