from django.db import models
from genders.models import Gender
from parents.models import Parent
from datetime import date

# Create your models here.

class Child(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=250)  # Field name made lowercase.
    surname = models.CharField(db_column='Surname', max_length=250)  # Field name made lowercase.
    gender = models.ForeignKey(Gender, models.DO_NOTHING, db_column='Gender')  # Field name made lowercase.
    birth_day = models.IntegerField(db_column='Birth_Day')  # Field name made lowercase.
    birth_month = models.IntegerField(db_column='Birth_Month')  # Field name made lowercase.
    birth_year = models.IntegerField(db_column='Birth_Year')  # Field name made lowercase.
    parent = models.ForeignKey(Parent, models.DO_NOTHING, db_column='Parent_Id')  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate', auto_now_add=True)  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Children'
        db_table_comment = 'Çocuklar Bilgisi'

    @property
    def birth_date(self):
        try:
            return date(self.birth_year, self.birth_month, self.birth_day)
        except ValueError:
            return None

    @property
    def gender_name(self):
        return self.gender.name if self.gender else None