# recommendation/urls.py
from django.urls import path
from .views import DailyRecommendationView

urlpatterns = [
    path("daily/", DailyRecommendationView.as_view()),
]
