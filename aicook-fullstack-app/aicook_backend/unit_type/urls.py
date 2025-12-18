from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UnitTypeController

router = DefaultRouter()
router.register(r'unit_type', UnitTypeController, basename='unit_type')

urlpatterns = [
    path('', include(router.urls)),
]