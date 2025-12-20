from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('', include('home.urls')),
    path('api/', include('articles.urls')),
    path('api/', include('gender.urls')),
    path('api/', include('users.urls')),
    path('api/', include('chat.urls')),
    path('api/', include('categories.urls')),
    path('api/', include('ingredients.urls')),
    path('api/', include('cooking_area_type.urls')),
    path('api/', include('time_type.urls')),
    path("api/", include("unit_type.urls")),
    path("api/", include("recipe_ingredients.urls")),
    path("api/recipes/", include("recipes.urls")),
    path("api/favorite/", include("favorite_recipes.urls")),
    path("api/meal_histories/", include("meal_histories.urls")),
    path('api/reports/', include('reports.urls')),
    path("api/fridge-photos/", include("fridge_photos.urls")),
    # path("api/upload/", include("services.urls"))
]
