from django.db import models
from users.models import Users
from recipes.models import Recipes

# Create your models here.
class FavoriteRecipes(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey(Users, models.DO_NOTHING, db_column='user_id')
    recipe = models.ForeignKey(Recipes, models.DO_NOTHING)
    active = models.IntegerField(db_column='active')
    create_date = models.DateTimeField(db_column='create_date', auto_now_add=True)
    update_date = models.DateTimeField(db_column='update_date', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'favorite_recipes'
        db_table_comment = 'favori yemek'