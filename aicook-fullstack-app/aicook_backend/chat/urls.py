from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatController

router = DefaultRouter()
router.register(r'openai', ChatController, basename='openai')

urlpatterns = [
    path('', include(router.urls)),
]
