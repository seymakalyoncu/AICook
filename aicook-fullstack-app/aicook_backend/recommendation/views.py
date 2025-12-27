from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.models import Users
from ml_engine.rf_daily_recommendation.predict_daily import get_daily_recommendation


class DailyRecommendationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication] 
    
    def get(self, request):
        user = Users.objects.get(id=request.user.id)
        result = get_daily_recommendation(user)
        return Response(result)