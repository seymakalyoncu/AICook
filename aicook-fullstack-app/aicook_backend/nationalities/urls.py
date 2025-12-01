from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NationalityController

router = DefaultRouter()
router.register(r'nationalities', NationalityController, basename='nationality')

urlpatterns = [
    path('', include(router.urls)),
]