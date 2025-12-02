from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmotionalStateController

router = DefaultRouter()
router.register(r'emotional_states', EmotionalStateController, basename='emotional_state')

urlpatterns = [
    path('', include(router.urls)),
]