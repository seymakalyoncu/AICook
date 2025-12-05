from django.db import models

# Create your models here.

class Gender(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='name', max_length=100)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='create_date')  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='update_date', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'gender'
        db_table_comment = 'Cinsiyet Bilgileri'