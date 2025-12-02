from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PhysicalDevelopmentRecordController

router = DefaultRouter()
router.register(r'physical_development_records', PhysicalDevelopmentRecordController, basename='physical_development_record')

urlpatterns = [
    path('', include(router.urls)),
]