from django.db import models
from users.models import Users

# Create your models here.
class FridgePhotos(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey(Users, models.DO_NOTHING, db_column='user_id')
    url = models.TextField(db_column='url')
    description = models.TextField(db_column='description', blank=True, null=True)
    create_date = models.DateTimeField(db_column='create_date', auto_now_add=True)
    update_date = models.DateTimeField(db_column='update_date', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fridge_photos'
        db_table_comment = 'buzdolabı fotoğ­rafı'