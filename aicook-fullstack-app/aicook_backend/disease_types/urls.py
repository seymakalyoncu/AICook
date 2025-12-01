from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiseaseTypeController

router = DefaultRouter()
router.register(r'disease_types', DiseaseTypeController, basename='disease_type')

urlpatterns = [
    path('', include(router.urls)),
]