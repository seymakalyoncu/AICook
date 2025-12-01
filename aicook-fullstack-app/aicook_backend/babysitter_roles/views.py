from rest_framework import viewsets
from .models import BabysitterRole
from .serializers import BabysitterRoleSerializer

class BabysitterRoleController(viewsets.ModelViewSet):
    queryset = BabysitterRole.objects.all()
    serializer_class = BabysitterRoleSerializer