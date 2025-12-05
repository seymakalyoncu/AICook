from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsersController

router = DefaultRouter()
router.register(r'users', UsersController, basename='users')

urlpatterns = [
    path('', include(router.urls)),
]