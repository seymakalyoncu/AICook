from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GenderController

router = DefaultRouter()
router.register(r'genders', GenderController, basename='gender')

urlpatterns = [
    path('', include(router.urls)),
]