from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CognitiveDevelopmentTypeController

router = DefaultRouter()
router.register(r'cognitive_development_types', CognitiveDevelopmentTypeController, basename='cognitive_development_type')

urlpatterns = [
    path('', include(router.urls)),
]