from django.db import models

class City(models.Model):
    id = models.IntegerField(db_column='ID', primary_key= True)
    name = models.CharField(db_column='Name', max_length=250)
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Cities'
        db_table_comment = 'İller Bilgisi'