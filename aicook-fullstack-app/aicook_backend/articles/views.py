from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer

class ArticleController(viewsets.ModelViewSet):
    permission_classes = []  # Sadece giriş yapmış kullanıcılar
    authentication_classes = []  # Cookie veya Token kabul eder
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer