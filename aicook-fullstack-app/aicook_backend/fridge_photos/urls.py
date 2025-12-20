from django.urls import path
from .views import FridgePhotoUploadView

urlpatterns = [
    path("upload/", FridgePhotoUploadView.as_view()),
]
