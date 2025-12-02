from rest_framework import viewsets
from .models import Role
from .serializers import RoleSerializer

class RoleController(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer