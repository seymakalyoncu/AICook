from django.urls import path
from .views import (FavoriteRecipeToggleView, FavoriteRecipeStatusView, FavoriteRecipeListView)


urlpatterns = [
    path("toggle/", FavoriteRecipeToggleView.as_view()),
    path("status/", FavoriteRecipeStatusView.as_view()),
    path("list/", FavoriteRecipeListView.as_view()),
]