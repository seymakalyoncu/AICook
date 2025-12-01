from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EducationStateController

router = DefaultRouter()
router.register(r'education_states', EducationStateController, basename='education_state')

urlpatterns = [
    path('', include(router.urls)),
]