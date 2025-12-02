from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgressReportController

router = DefaultRouter()
router.register(r'progress_reports', ProgressReportController, basename='progress_report')

urlpatterns = [
    path('', include(router.urls)),
]