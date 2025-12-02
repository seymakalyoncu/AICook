from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BabysitterController

router = DefaultRouter()
router.register(r'babysitters', BabysitterController, basename='babysitter')

urlpatterns = [
    path('', include(router.urls))
]