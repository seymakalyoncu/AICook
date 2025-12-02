from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MotorDevelopmentTypeController

router = DefaultRouter()
router.register(r'motor_development_types', MotorDevelopmentTypeController, basename='motor_development_type')

urlpatterns = [
    path('', include(router.urls)),
]