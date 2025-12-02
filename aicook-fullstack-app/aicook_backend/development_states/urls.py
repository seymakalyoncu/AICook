from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DevelopmentStateController

router = DefaultRouter()
router.register(r'development_states', DevelopmentStateController, basename='development_state')

urlpatterns = [
    path('', include(router.urls)),
]