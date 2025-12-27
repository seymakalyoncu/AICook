from django.db import models
from users.models import Users
from recipes.models import Recipes

# Create your models here.
class MealHistories(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey(Users, models.DO_NOTHING, db_column='user_id')
    recipe = models.ForeignKey(Recipes, models.DO_NOTHING)
    cooked_date = models.DateTimeField(db_column='cooked_date')
    comment = models.TextField(db_column='comment', blank=True, null=True)
    rating = models.IntegerField(db_column='rating', blank=True, null=True)
    create_date = models.DateTimeField(db_column='create_date', auto_now_add=True)
    update_date = models.DateTimeField(db_column='update_date', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'meal_histories'
        db_table_comment = 'Yemek geçmişi'