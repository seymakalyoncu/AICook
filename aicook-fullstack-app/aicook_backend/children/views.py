from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import ValidationError
from .models import Child
from .serializers import ChildSerializer


class ChildController(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = ChildSerializer

    def get_queryset(self):
        queryset = Child.objects.all()
        parent_id = self.request.query_params.get('parentId')
        print(parent_id)
        if parent_id:
            queryset = queryset.filter(parent=parent_id)

        return queryset
    
  