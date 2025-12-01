from django.db import models
from django.contrib.auth.models import User
from genders.models import Gender
from nationalities.models import Nationality
from education_states.models import EducationState
from parents.models import Parent

# Create your models here.

class Babysitter(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=250)  # Field name made lowercase.
    surname = models.CharField(db_column='Surname', max_length=250)  # Field name made lowercase.
    gender = models.ForeignKey(Gender, models.DO_NOTHING, db_column='Gender')  # Field name made lowercase.
    nationality = models.ForeignKey(Nationality, models.DO_NOTHING, db_column='Nationality')  # Field name made lowercase.
    birth_day = models.IntegerField(db_column='Birth_Day')  # Field name made lowercase.
    birth_month = models.IntegerField(db_column='Birth_Month')  # Field name made lowercase.
    birth_year = models.IntegerField(db_column='Birth_Year')  # Field name made lowercase.
    email = models.CharField(db_column='EMail', max_length=255)  # Field name made lowercase.
    education = models.ForeignKey(EducationState, models.DO_NOTHING, db_column='Education')  # Field name made lowercase.
    parent = models.ForeignKey(Parent, models.DO_NOTHING, db_column='Parent_Id')  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    user_id = models.ForeignKey(User, models.DO_NOTHING, db_column='User_Id', null=True)

    class Meta:
        managed = False
        db_table = 'Babysitters'
        db_table_comment = 'Bakıcılar Bilgisi'