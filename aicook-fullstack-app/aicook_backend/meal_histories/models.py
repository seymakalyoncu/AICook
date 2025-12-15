from django.db import models

# Create your models here.
class MealHistories(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey('users.Users', models.DO_NOTHING)
    recipe = models.ForeignKey('Recipes', models.DO_NOTHING)
    cooked_date = models.DateTimeField()
    comment = models.TextField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'meal_histories'
        db_table_comment = 'Yemek geçmişi'