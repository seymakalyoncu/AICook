from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models.functions import Coalesce
from .models import MealHistories
from .serializers import MealHistorySerializer
from users.models import Users
from recipes.models import Recipes

# Kayıt oluşturma
class MealHistoryCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data

        try:
            user = Users.objects.get(id=data.get("user_id"))
            recipe = Recipes.objects.get(id=data.get("recipe_id"))

            meal_history = MealHistories.objects.create(
                user=user,
                recipe=recipe,
                cooked_date=data.get("cooked_date"),
                comment=data.get("comment", ""),
                rating=data.get("rating", None)
            )

            serializer = MealHistorySerializer(meal_history)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Users.DoesNotExist:
            return Response({"error": "User bulunamadı"}, status=status.HTTP_400_BAD_REQUEST)
        except Recipes.DoesNotExist:
            return Response({"error": "Recipe bulunamadı"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MealHistoryListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            users_obj = Users.objects.get(id=request.user.id)
        except Users.DoesNotExist:
            return Response(
                {"error": "Users kaydı bulunamadı"},
                status=status.HTTP_404_NOT_FOUND
            )

        histories = (
            MealHistories.objects
            .filter(user=users_obj)
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
        for h in histories:
            r = h.recipe
            data.append({
                # MEAL HISTORY
                "meal_history_id": h.id,
                "cooked_date": h.cooked_date,
                "rating": h.rating,
                "comment": h.comment,

                # RECIPE
                "recipe_id": r.id,
                "title": r.recipe,
                "category": r.category.name if r.category else None,
                "cooking_area": r.cooking_area_type.name if r.cooking_area_type else None,
                "cooking_time": r.cooking_time,
                "time_type": r.time_type.name if r.time_type else None,
                "servings": r.servings,
                "description": r.description,
            })

        return Response(data, status=status.HTTP_200_OK)
