from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from django.db.models.functions import Coalesce
from .models import FavoriteRecipes
from recipes.models import Recipes
from users.models import Users


class FavoriteRecipeToggleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        recipe_id = request.data.get("recipe_id")

        if not recipe_id:
            return Response({"error": "recipe_id gerekli"}, status=400)

        # 🔥 auth_user.id == users.id
        try:
            users_obj = Users.objects.get(id=request.user.id)
        except Users.DoesNotExist:
            return Response(
                {"error": "Users kaydı bulunamadı"},
                status=404
            )

        try:
            recipe = Recipes.objects.get(id=recipe_id)
        except Recipes.DoesNotExist:
            return Response(
                {"error": "Tarif bulunamadı"},
                status=404
            )

        favorite, created = FavoriteRecipes.objects.get_or_create(
            user=users_obj,   # 🔥 DOĞRU NESNE
            recipe=recipe,
            defaults={"active": 1}
        )

        if not created:
            favorite.active = 0 if favorite.active == 1 else 1
            favorite.update_date = timezone.now()
            favorite.save()

        return Response({"active": favorite.active})

class FavoriteRecipeStatusView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recipe_id = request.query_params.get("recipe_id")

        if not recipe_id:
            return Response({"error": "recipe_id gerekli"}, status=400)

        try:
            users_obj = Users.objects.get(id=request.user.id)
        except Users.DoesNotExist:
            return Response(
                {"error": "Users kaydı bulunamadı"},
                status=404
            )

        try:
            favorite = FavoriteRecipes.objects.get(
                user=users_obj,
                recipe_id=recipe_id
            )
            active = favorite.active
        except FavoriteRecipes.DoesNotExist:
            active = 0

        return Response({"active": active})

class FavoriteRecipeListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            users_obj = Users.objects.get(id=request.user.id)
        except Users.DoesNotExist:
            return Response(
                {"error": "Users kaydı bulunamadı"},
                status=404
            )

        favorites = (
            FavoriteRecipes.objects
            .filter(user=users_obj, active=1)
            .annotate(
                order_date=Coalesce("update_date", "create_date")
            )
            .select_related(
                "recipe",
                "recipe__category",
                "recipe__cooking_area_type",
                "recipe__time_type"
            )
            .order_by("-order_date")
        )

        data = []
        for fav in favorites:
            r = fav.recipe
            data.append({
                "id": r.id,
                "title": r.recipe,
                "category": r.category.name if r.category else None,
                "cooking_area": r.cooking_area_type.name if r.cooking_area_type else None,
                "cooking_time": r.cooking_time,
                "time_type": r.time_type.name if r.time_type else None,
                "servings": r.servings,
                "description": r.description,
            })

        return Response(data)
