from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MealRecordController

router = DefaultRouter()
router.register(r'meal_records', MealRecordController, basename='meal_record')

urlpatterns = [
    path('', include(router.urls)),
]