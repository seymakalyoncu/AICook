from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HealthRecordController

router = DefaultRouter()
router.register(r'health_records', HealthRecordController, basename='health_record')

urlpatterns = [
    path('', include(router.urls)),
]