from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BabysitterRoleController

router = DefaultRouter()
router.register(r'babysitter_roles', BabysitterRoleController, basename='babysitter_role')

urlpatterns = [
    path('', include(router.urls)),
]