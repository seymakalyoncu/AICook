from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SleepRecordController

router = DefaultRouter()
router.register(r'sleep_records', SleepRecordController, basename='sleep_record')

urlpatterns = [
    path('', include(router.urls)),
]