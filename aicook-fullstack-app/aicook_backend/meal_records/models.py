from django.db import models
from children.models import Child
from meal_times.models import MealTime


# Create your models here.

class MealRecord(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    child = models.ForeignKey(Child, models.DO_NOTHING, db_column='Child_Id')  # Field name made lowercase.
    meal_name = models.CharField(db_column='Meal_Name', max_length=250)  # Field name made lowercase.
    meal_type = models.ForeignKey(MealTime, models.DO_NOTHING, db_column='Meal_Type')  # Field name made lowercase.
    nutritive_value = models.IntegerField(db_column='Nutritive_Value')  # Field name made lowercase.
    meal_datetime = models.DateTimeField(db_column='Meal_Datetime')  # Field name made lowercase.
    comment = models.TextField(db_column='Comment', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Meal_Records'
        db_table_comment = 'Yemek Kayıtları'