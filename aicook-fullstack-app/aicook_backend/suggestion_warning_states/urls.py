from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SuggestionWarningStateController

router = DefaultRouter()
router.register(r'suggestion_warning_states', SuggestionWarningStateController, basename='suggestion_warning_state')

urlpatterns = [
    path('', include(router.urls)),
]