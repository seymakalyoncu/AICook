from django.db import models

# Create your models here.
class CookingAreaType(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.TextField()
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'cooking_area_type'
        db_table_comment = 'yemek pisirme yeri'