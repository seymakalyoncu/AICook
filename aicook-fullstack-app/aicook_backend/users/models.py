from django.db import models
from django.contrib.auth.models import User
from gender.models import Gender

# Create your models here.

class Users(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='first_name', max_length=250)  # Field name made lowercase.
    surname = models.CharField(db_column='last_name', max_length=250)  # Field name made lowercase.
    gender = models.ForeignKey(Gender, models.DO_NOTHING, db_column='gender')  # Field name made lowercase.
    birth_day = models.IntegerField(db_column='birth_day')  # Field name made lowercase.
    birth_month = models.IntegerField(db_column='birth_month')  # Field name made lowercase.
    birth_year = models.IntegerField(db_column='birth_year')  # Field name made lowercase.
    email = models.CharField(db_column='eMail', max_length=255)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='create_date', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='update_date', auto_now=True)  # Field name made lowercase.
    user_id = models.ForeignKey(User, models.DO_NOTHING, db_column='user_id')
    
    class Meta:
        db_table = 'users'
        db_table_comment = 'Kullanıcıların Bilgisi'