from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from recipes.models import Recipes
from ingredients.models import Ingredients
from recipe_ingredients.models import RecipeIngredients
from django.db.models import Q
from .serializers import RecipeSearchSerializer

class RecipeSearchView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        data = request.data
        search_type = data.get("searchType", "input")  # default input

        recipes = Recipes.objects.all()

        if search_type == "input":
            # Search ikonu ile gelen arama
            ingredients_str = data.get("ingredients", "")
            ingredient_names = [i.strip().lower() for i in ingredients_str.split(";") if i.strip()]
            if ingredient_names:
                ingredient_q = Q()
                for name in ingredient_names:
                    ingredient_q |= Q(name__iexact=name)
                ingredient_ids = Ingredients.objects.filter(ingredient_q).values_list("id", flat=True)
                recipe_ids = RecipeIngredients.objects.filter(ingredient_id__in=ingredient_ids).values_list("recipe_id", flat=True)
                recipes = recipes.filter(id__in=recipe_ids)

        elif search_type == "filter":
            # Filter modal ile gelen arama
            ingredients_list = data.get("ingredients", [])
            if ingredients_list:
                recipe_ids_list = RecipeIngredients.objects.filter(ingredient_id__in=ingredients_list).values_list("recipe_id", flat=True)
                recipes = recipes.filter(id__in=recipe_ids_list)

            category_id = data.get("category")
            if category_id:
                recipes = recipes.filter(category_id=category_id)

            cooking_area_type_id = data.get("cooking_area_type")
            if cooking_area_type_id:
                recipes = recipes.filter(cooking_area_type_id=cooking_area_type_id)

            time_type_id = data.get("time_type")
            if time_type_id:
                recipes = recipes.filter(time_type_id=time_type_id)

            cook_time = data.get("cook_time")
            if cook_time is not None:
                recipes = recipes.filter(cooking_time__lte=cook_time)

        serializer = RecipeSearchSerializer(recipes.distinct(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
