from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VaccinationRecordController

router = DefaultRouter()
router.register(r'vaccination_records', VaccinationRecordController, basename='vaccination_record')

urlpatterns = [
    path('', include(router.urls)),
]