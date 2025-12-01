from rest_framework import viewsets
from .models import ParentRole
from .serializers import ParentRoleSerializer

class ParentRoleController(viewsets.ModelViewSet):
    queryset = ParentRole.objects.all()
    serializer_class = ParentRoleSerializer