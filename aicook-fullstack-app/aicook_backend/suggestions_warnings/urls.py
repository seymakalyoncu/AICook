from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SuggestionsWarningController

router = DefaultRouter()
router.register(r'suggestions_warnings', SuggestionsWarningController, basename='suggestions_warning')

urlpatterns = [
    path('', include(router.urls)),
]