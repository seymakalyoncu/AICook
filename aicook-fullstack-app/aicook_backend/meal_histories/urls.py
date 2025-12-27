# urls.py
from django.urls import path
from .views import MealHistoryCreateView, MealHistoryListView

urlpatterns = [
    path("create/", MealHistoryCreateView.as_view(), name="meal_history_create"),
    path("", MealHistoryListView.as_view(), name="meal_history_list"),  # GET için
]
