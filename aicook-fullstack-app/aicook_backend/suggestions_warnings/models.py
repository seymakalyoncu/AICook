from django.db import models
from parents.models import Parent
from suggestion_warning_states.models import SuggestionWarningState

# Create your models here.

class SuggestionsWarning(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    parent = models.ForeignKey(Parent, models.DO_NOTHING, db_column='Parent_Id')  # Field name made lowercase.
    text = models.IntegerField(db_column='Text', blank=True, null=True)  # Field name made lowercase.
    state = models.ForeignKey(SuggestionWarningState, models.DO_NOTHING, db_column='State', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateTimeField(db_column='CreatedDate')  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Suggestions_Warnings'
        db_table_comment = 'Öneriler/Uyarılar Bilgisi'
