from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IngredientsController

router = DefaultRouter()
router.register(r'ingredients', IngredientsController, basename='ingredients')

urlpatterns = [
    path('', include(router.urls)),
]