from django.db import models


class Categories(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.TextField()
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'categories'
        db_table_comment = 'yemek kategorisi'

class CookingAreaType(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.TextField()
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'cooking_area_type'
        db_table_comment = 'yemek pisirme yeri'

class TimeType(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.TextField()
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'time_type'
        db_table_comment = 'zaman birimi'

class UnitType(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.TextField()
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'unit_type'
        db_table_comment = 'ölçü birimi'

class Ingredients(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.TextField()
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ingredients'
        db_table_comment = 'malzeme'

class Recipes(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    category = models.ForeignKey('Categories', models.DO_NOTHING)
    recipe = models.TextField()
    cooking_time = models.IntegerField()
    time_type = models.ForeignKey('TimeType', models.DO_NOTHING, db_column='time_type')
    cooking_area_type = models.ForeignKey('CookingAreaType', models.DO_NOTHING, db_column='cooking_area_type')
    servings = models.IntegerField()
    description = models.TextField()
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recipes'
        db_table_comment = 'Yemek tarifi'

class FavoriteRecipes(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey('users.Users', models.DO_NOTHING)
    recipe = models.ForeignKey('Recipes', models.DO_NOTHING)
    active = models.IntegerField()
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'favorite_recipes'
        db_table_comment = 'favori yemek'

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

class MealHistories(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey('users.Users', models.DO_NOTHING)
    recipe = models.ForeignKey('Recipes', models.DO_NOTHING)
    cooked_date = models.DateTimeField()
    comment = models.TextField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'meal_histories'
        db_table_comment = 'Yemek geçmişi'

class RecipeIngredients(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    create_date = models.DateTimeField()
    update_date = models.DateTimeField(blank=True, null=True)
    recipe = models.ForeignKey('Recipes', models.DO_NOTHING)
    ingredient = models.ForeignKey('Ingredients', models.DO_NOTHING)
    unit_type = models.ForeignKey('UnitType', models.DO_NOTHING, db_column='unit_type')
    unit = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'recipe_ingredients'
        db_table_comment = 'yemek malzeme ilişkisi'
