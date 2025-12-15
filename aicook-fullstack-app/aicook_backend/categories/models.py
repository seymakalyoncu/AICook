from django.db import models

# Create your models here.
class Categories(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.TextField()
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'categories'
        db_table_comment = 'yemek kategorisi'