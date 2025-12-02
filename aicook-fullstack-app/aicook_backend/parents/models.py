from django.db import models
from django.contrib.auth.models import User
from education_states.models import EducationState
from cities.models import City
from districts.models import District
from nationalities.models import Nationality
from genders.models import Gender

# Create your models here.

class Parent(models.Model):
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
    city = models.ForeignKey(City, models.DO_NOTHING, db_column='City', blank=True, null=True)  # Field name made lowercase.
    districts = models.ForeignKey(District, models.DO_NOTHING, db_column='Districts', blank=True, null=True)  # Field name made lowercase.
    notification_state = models.BooleanField(db_column='Notification', blank=True, null=True, default=False)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    user_id = models.ForeignKey(User, models.DO_NOTHING, db_column='User_Id')
    
    class Meta:
        managed = False
        db_table = 'Parents'
        db_table_comment = 'Ebeveynlerin Bilgisi'