from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SleepQualityStateController

router = DefaultRouter()
router.register(r'sleep_quality_states', SleepQualityStateController, basename='sleep_quality_state')

urlpatterns = [
    path('', include(router.urls)),
]