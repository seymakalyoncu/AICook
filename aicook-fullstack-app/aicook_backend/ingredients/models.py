from django.db import models

# Create your models here.
class Ingredients(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.TextField(db_column='name', max_length=250)
    create_date = models.DateTimeField(db_column='create_date')
    update_date = models.DateTimeField(db_column='update_date', blank=True, null=True)
    yolo_key = models.TextField(db_column='yolo_key', max_length=250)

    class Meta:
        managed = False
        db_table = 'ingredients'
        db_table_comment = 'malzeme'