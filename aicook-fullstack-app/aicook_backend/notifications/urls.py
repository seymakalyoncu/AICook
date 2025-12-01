from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationController

router = DefaultRouter()
router.register(r'notifications', NotificationController, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]