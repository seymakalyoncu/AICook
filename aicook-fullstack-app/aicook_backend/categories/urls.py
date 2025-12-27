from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriesController

router = DefaultRouter()
router.register(r'categories', CategoriesController, basename='categories')

urlpatterns = [
    path('', include(router.urls)),
]