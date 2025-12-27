from django.db import models
from recipes.models import Recipes
from ingredients.models import Ingredients
from unit_type.models import UnitType

# Create your models here.
class RecipeIngredients(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    create_date = models.DateTimeField(db_column='create_date')
    update_date = models.DateTimeField(db_column='update_date', blank=True, null=True)
    recipe = models.ForeignKey(Recipes, models.DO_NOTHING)
    ingredient = models.ForeignKey(Ingredients, models.DO_NOTHING)
    unit_type = models.ForeignKey(UnitType, models.DO_NOTHING, db_column='unit_type')
    unit = models.IntegerField(db_column='unit')

    class Meta:
        managed = False
        db_table = 'recipe_ingredients'
        db_table_comment = 'yemek malzeme ilişkisi'