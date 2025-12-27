from django.db import models

class HistoryCategory(models.Model):
    user_id = models.IntegerField()
    category = models.TextField()
    sayi = models.IntegerField()
    class Meta:
        managed = False
        db_table = 'v_history_category'

class HistoryDate(models.Model):
    user_id = models.IntegerField()
    date = models.DateTimeField()
    sayi = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'v_history_date'

class HistoryIngredient(models.Model):
    user_id = models.IntegerField()
    ingredient = models.TextField()
    sayi = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'v_history_ingredient'

class HistoryRating(models.Model):
    user_id = models.IntegerField()
    category = models.TextField()
    category_rating = models.FloatField()

    class Meta:
        managed = False
        db_table = 'v_history_rating'
