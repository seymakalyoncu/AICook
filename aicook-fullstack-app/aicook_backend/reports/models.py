from django.db import models

# 1. Fiziksel gelişim view’i
class PhysicalDevelopmentView(models.Model):
    parent_id = models.IntegerField()
    child_id = models.IntegerField()
    measurement_date = models.DateField()
    height = models.FloatField()
    weight = models.FloatField()

    class Meta:
        managed = False
        db_table = 'v_total_height_weight'

# 2. Uyku süresi son 30 gün
class TotalSleepView(models.Model):
    parent_id = models.IntegerField()
    child_id = models.IntegerField()   
    sleep_date = models.DateField()
    total_sleep = models.FloatField()

    class Meta:
        managed = False
        db_table = 'v_total_sleep'

# 3. Toplam kalori son 30 gün
class TotalMealNutritiveView(models.Model):
    parent_id = models.IntegerField()
    child_id = models.IntegerField()
    meal_date = models.DateField()
    total_nutritive = models.FloatField()

    class Meta:
        managed = False
        db_table = 'v_total_nutritive'
