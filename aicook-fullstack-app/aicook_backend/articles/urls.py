from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleController

router = DefaultRouter()
router.register(r'articles', ArticleController, basename='article')

urlpatterns = [
    path('', include(router.urls)),
]