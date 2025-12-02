from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FineGrossMotorTypeController

router = DefaultRouter()
router.register(r'fine_gross_motor_types', FineGrossMotorTypeController, basename='fine_gross_motor_type')

urlpatterns = [
    path('', include(router.urls)),
]