from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Parent
from .serializers import ParentSerializer

class ParentController(viewsets.ModelViewSet):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    # def get_queryset(self):
    #     user = self.request.user
    #     return Parent.objects.filter(user_id=user.id)