from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CognitiveDevelopmentRecordController

router = DefaultRouter()
router.register(r'cognitive_development_records', CognitiveDevelopmentRecordController, basename='cognitive_development_record')

urlpatterns = [
    path('', include(router.urls)),
]