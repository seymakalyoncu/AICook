from django.db import models

# Create your models here.
class Recipes(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    category = models.ForeignKey('Categories', models.DO_NOTHING)
    recipe = models.TextField()
    cooking_time = models.IntegerField()
    time_type = models.ForeignKey('TimeType', models.DO_NOTHING, db_column='time_type')
    cooking_area_type = models.ForeignKey('CookingAreaType', models.DO_NOTHING, db_column='cooking_area_type')
    servings = models.IntegerField()
    description = models.TextField()
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recipes'
        db_table_comment = 'Yemek tarifi'