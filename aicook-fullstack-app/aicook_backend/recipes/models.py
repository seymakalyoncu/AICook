from django.db import models
from categories.models import Categories
from time_type.models import TimeType
from cooking_area_type.models import CookingAreaType

# Create your models here.
class Recipes(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    category = models.ForeignKey(Categories, models.DO_NOTHING, db_column='category_id')
    recipe = models.TextField(db_column='recipe')
    cooking_time = models.IntegerField(db_column='cooking_time')
    time_type = models.ForeignKey(TimeType, models.DO_NOTHING, db_column='time_type')
    cooking_area_type = models.ForeignKey(CookingAreaType, models.DO_NOTHING, db_column='cooking_area_type')
    servings = models.IntegerField(db_column='servings')
    description = models.TextField(db_column='description')
    create_date = models.DateTimeField(db_column='create_date', auto_now_add=True)
    update_date = models.DateTimeField(db_column='update_date', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recipes'
        db_table_comment = 'Yemek tarifi'