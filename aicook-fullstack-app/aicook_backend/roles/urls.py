from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoleController

router = DefaultRouter()
router.register(r'roles', RoleController, basename='role')

urlpatterns = [
    path('', include(router.urls)),
]