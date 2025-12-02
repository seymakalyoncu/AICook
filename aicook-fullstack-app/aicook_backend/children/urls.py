from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChildController

router = DefaultRouter()
router.register(r'children', ChildController, basename='child')

urlpatterns = [
    path('', include(router.urls)),
]