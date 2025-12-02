from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MealTimeController

router = DefaultRouter()
router.register(r'meal_times', MealTimeController, basename='meal_time')

urlpatterns = [
    path('', include(router.urls)),
]