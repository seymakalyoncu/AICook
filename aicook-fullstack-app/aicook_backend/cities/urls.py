from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CityController

router = DefaultRouter()
router.register(r'cities', CityController, basename='city')

urlpatterns = [
    path('', include(router.urls)),
]