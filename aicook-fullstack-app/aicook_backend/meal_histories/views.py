from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication

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
            user = Users.objects.get(email=request.user)  # JWT ile doğrulanmış user
            
            # Kullanıcının tüm meal histories kayıtları
            histories = MealHistories.objects.filter(user=user).select_related('recipe')

            serializer = MealHistorySerializer(histories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errorx": str(e)}, status=status.HTTP_400_BAD_REQUEST)
