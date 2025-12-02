from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ParentRoleController

router = DefaultRouter()
router.register(r'parent_roles', ParentRoleController, basename='parent_role')

urlpatterns = [
    path('', include(router.urls)),
]