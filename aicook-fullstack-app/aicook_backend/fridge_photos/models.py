from django.db import models

# Create your models here.
class FridgePhotos(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey('users.Users', models.DO_NOTHING)
    url = models.TextField()
    description = models.TextField(blank=True, null=True)
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fridge_photos'
        db_table_comment = 'buzdolabı fotoğ­rafı'