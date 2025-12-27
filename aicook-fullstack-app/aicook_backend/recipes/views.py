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
        search_type = data.get("searchType", "input")
        user_ingredient_ids = data.get("ingredients", [])

        if user_ingredient_ids and isinstance(user_ingredient_ids[0], str):
            try:
                user_ingredient_ids = [int(i) for i in user_ingredient_ids]
            except ValueError:
                user_ingredient_ids = []

        recipes = Recipes.objects.all()

        if search_type == "input":
            ingredients_str = data.get("ingredients", "")
            ingredient_names = [str(i).strip().lower() for i in ingredients_str.split(";") if i.strip()]

            if ingredient_names:
                ingredient_q = Q()
                for name in ingredient_names:
                    ingredient_q |= Q(name__iexact=name)

                ingredient_ids = Ingredients.objects.filter(
                    ingredient_q
                ).values_list("id", flat=True)

                recipe_ids = RecipeIngredients.objects.filter(
                    ingredient_id__in=ingredient_ids
                ).values_list("recipe_id", flat=True)

                recipes = recipes.filter(id__in=recipe_ids)

        elif search_type == "filter":
            ingredients_list = data.get("ingredients", [])
            if ingredients_list:
                recipe_ids_list = RecipeIngredients.objects.filter(
                    ingredient_id__in=ingredients_list
                ).values_list("recipe_id", flat=True)

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

        # ✅ CATEGORY_ID'YE GÖRE SIRALAMA
        recipes = recipes.order_by("category_id", "id")

        serializer = RecipeSearchSerializer(recipes.distinct(), many=True)
        data_with_ingredients = []

        for recipe_data in serializer.data:
            recipe_obj = Recipes.objects.get(id=recipe_data["id"])
            recipe_ingredient_list = self._get_recipe_ingredient_list(
                recipe_obj, user_ingredient_ids
            )
            recipe_data["recipe_ingredient_list"] = recipe_ingredient_list
            data_with_ingredients.append(recipe_data)

        return Response(data_with_ingredients, status=status.HTTP_200_OK)

    def _get_recipe_ingredient_list(self, recipe, user_ingredient_ids):
        """
        Tarife ait malzemeleri al ve kullanıcı seçimine göre işaretle.
        """
        ingredients_list = RecipeIngredients.objects.filter(recipe_id=recipe.id).select_related('ingredient')
        recipe_ingredient_list = []

        # user_ingredient_ids set olarak tanımla → daha hızlı ve güvenli
        user_ids_set = set(user_ingredient_ids)

        for ri in ingredients_list:
            recipe_ingredient_list.append({
                "id": ri.ingredient.id,
                "name": ri.ingredient.name,
                "selected": ri.ingredient.id in user_ids_set  # True → siyah, False → kırmızı
            })
        return recipe_ingredient_list
