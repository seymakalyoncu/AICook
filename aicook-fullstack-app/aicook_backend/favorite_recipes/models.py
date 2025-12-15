from django.db import models

# Create your models here.
class FavoriteRecipes(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey('users.Users', models.DO_NOTHING)
    recipe = models.ForeignKey('Recipes', models.DO_NOTHING)
    active = models.IntegerField()
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'favorite_recipes'
        db_table_comment = 'favori yemek'