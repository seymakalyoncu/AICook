from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyEventTypeController

router = DefaultRouter()
router.register(r'daily_event_types', DailyEventTypeController, basename='daily_event_type')

urlpatterns = [
    path('', include(router.urls)),
]