from django.db import models

# Create your models here.
class RecipeIngredients(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)
    recipe = models.ForeignKey('Recipes', models.DO_NOTHING)
    ingredient = models.ForeignKey('Ingredients', models.DO_NOTHING)
    unit_type = models.ForeignKey('UnitType', models.DO_NOTHING, db_column='unit_type')
    unit = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'recipe_ingredients'
        db_table_comment = 'yemek malzeme ilişkisi'