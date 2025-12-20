from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UploadFileView

router = DefaultRouter()
router.register(r'upload-file', UploadFileView, basename='upload-file')

urlpatterns = [
    path('', include(router.urls)),
]