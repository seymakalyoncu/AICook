from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MotorDevelopmentRecordController

router = DefaultRouter()
router.register(r'motor_development_records', MotorDevelopmentRecordController, basename='motor_development_record')

urlpatterns = [
    path('', include(router.urls)),
]