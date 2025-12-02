from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportTypeController

router = DefaultRouter()
router.register(r'report_types', ReportTypeController, basename='report_type')

urlpatterns = [
    path('', include(router.urls)),
]