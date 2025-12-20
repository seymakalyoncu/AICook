from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import (HistoryCategory, HistoryDate, HistoryIngredient, HistoryRating)
from .serializers import (HistoryCategorySerializer, HistoryDateSerializer, HistoryIngredientSerializer, HistoryRatingSerializer)

class HistoryCategoryList(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, user_id, *args, **kwargs):
        data = HistoryCategory.objects.filter(user_id=user_id)
        serializer = HistoryCategorySerializer(data, many=True)
        return Response(serializer.data)

class HistoryDateList(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, user_id, *args, **kwargs):
        data = HistoryDate.objects.filter(user_id=user_id).order_by("date") 
        serializer = HistoryDateSerializer(data, many=True)
        return Response(serializer.data)

class HistoryIngredientList(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, user_id, *args, **kwargs):
        data = HistoryIngredient.objects.filter(user_id=user_id)
        serializer = HistoryIngredientSerializer(data, many=True)
        return Response(serializer.data)

class HistoryRatingList(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, user_id, *args, **kwargs):
        data = HistoryRating.objects.filter(user_id=user_id)
        serializer = HistoryRatingSerializer(data, many=True)
        return Response(serializer.data)