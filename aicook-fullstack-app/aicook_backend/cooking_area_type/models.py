from django.db import models

# Create your models here.
class CookingAreaType(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.TextField(db_column='name', max_length=250)
    create_date = models.DateTimeField(db_column='create_date')
    update_date = models.DateTimeField(db_column='update_date', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'cooking_area_type'
        db_table_comment = 'yemek pisirme yeri'