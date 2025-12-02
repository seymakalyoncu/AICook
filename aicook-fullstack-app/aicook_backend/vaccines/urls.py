from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VaccineController

router = DefaultRouter()
router.register(r'vaccines', VaccineController, basename='vaccine')

urlpatterns = [
    path('', include(router.urls)),
]