from django.urls import path
from .views import FridgePhotoUploadView
from .views import FridgePhotoListView
from .views import AnalyzePhotoView

urlpatterns = [
    path("upload/", FridgePhotoUploadView.as_view()),
    path("list/", FridgePhotoListView.as_view()),
    path("analyze-photo/<int:photo_id>/", AnalyzePhotoView.as_view()),
]
