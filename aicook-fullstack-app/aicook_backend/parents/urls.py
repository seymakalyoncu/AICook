from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ParentController

router = DefaultRouter()
router.register(r'parents', ParentController, basename='parent')

urlpatterns = [
    path('', include(router.urls)),
]