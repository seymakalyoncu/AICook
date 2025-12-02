from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyEventRecordController

router = DefaultRouter()
router.register(r'daily_event_records', DailyEventRecordController, basename='daily_event_record')

urlpatterns = [
    path('', include(router.urls)),
]