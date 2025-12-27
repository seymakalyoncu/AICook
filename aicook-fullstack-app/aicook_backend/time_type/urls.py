from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TimeTypeController

router = DefaultRouter()
router.register(r'time_type', TimeTypeController, basename='time_type')

urlpatterns = [
    path('', include(router.urls)),
]