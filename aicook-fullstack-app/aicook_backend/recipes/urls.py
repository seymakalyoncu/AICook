from django.urls import path
from .views import RecipeSearchView

urlpatterns = [
    path("search/", RecipeSearchView.as_view(), name="recipe-search"),
]
