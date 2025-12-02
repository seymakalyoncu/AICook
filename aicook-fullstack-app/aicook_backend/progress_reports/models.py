from django.db import models
from report_types.models import ReportType
from children.models import Child

# Create your models here.

class ProgressReport(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    child = models.ForeignKey(Child, models.DO_NOTHING, db_column='Child_Id')  # Field name made lowercase.
    report_type = models.ForeignKey(ReportType, models.DO_NOTHING, db_column='Report_Type')  # Field name made lowercase.
    report_datetime = models.DateTimeField(db_column='Report_Datetime')  # Field name made lowercase.
    contents = models.TextField(db_column='Contents')  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate')  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Progress_Reports'
        db_table_comment = 'Gelişim Raporları'