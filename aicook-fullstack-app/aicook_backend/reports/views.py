from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import (
    PhysicalDevelopmentView,
    TotalSleepView,
    TotalMealNutritiveView
)
from .serializers import (
    PhysicalDevelopmentSerializer,
    TotalSleepSerializer,
    TotalMealNutritiveSerializer
)

class PhysicalDevelopmentList(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, child_id, *args, **kwargs):
        data = PhysicalDevelopmentView.objects.filter(child_id=child_id)
        serializer = PhysicalDevelopmentSerializer(data, many=True)
        return Response(serializer.data)

class TotalSleepList(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, child_id, *args, **kwargs):
        data = TotalSleepView.objects.filter(child_id=child_id)
        serializer = TotalSleepSerializer(data, many=True)
        return Response(serializer.data)

class TotalMealNutritiveList(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, child_id, *args, **kwargs):
        data = TotalMealNutritiveView.objects.filter(child_id=child_id)
        serializer = TotalMealNutritiveSerializer(data, many=True)
        return Response(serializer.data)
