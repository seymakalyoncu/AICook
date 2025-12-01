from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmotionalDevelopmentRecordController

router = DefaultRouter()
router.register(r'emotional_development_records', EmotionalDevelopmentRecordController, basename='emotional_development_record')

urlpatterns = [
    path('', include(router.urls)),
]