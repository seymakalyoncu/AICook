from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CookingAreaTypeController

router = DefaultRouter()
router.register(r'cooking_area_type', CookingAreaTypeController, basename='cooking_area_type')

urlpatterns = [
    path('', include(router.urls)),
]