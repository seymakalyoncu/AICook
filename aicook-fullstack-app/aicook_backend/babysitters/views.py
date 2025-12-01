from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from utils.token import generate_token
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from .models import Babysitter
from .serializers import BabysitterSerializer

class BabysitterController(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    authentication_classes = []

    queryset = Babysitter.objects.all()
    serializer_class = BabysitterSerializer

    def create(self, request, *args, **kwargs):
        # Veriyi serialize et
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Kaydı veritabanına kaydet
        self.perform_create(serializer)

        # AFTER INSERT işlemi (örneğin: e-posta gönderimi)
        instance = serializer.instance
        self.after_create(instance)

        # Standart cevap
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def after_create(self, instance):
        # Örnek mail gönderimi
        uid = urlsafe_base64_encode(force_bytes(instance.id))
        token = generate_token(instance.email)
        activation_link = f"http://localhost:3000/authentication/babysitter-verify-email?uid={uid}&token={token}"

        subject = "AICOOK Email Doğrulama"

        message= f""" 
                Merhaba, <br><br>

                E-posta adresinizi doğrulamak için <a href="{activation_link}">tıklayınız.</a> <br><br>

                Doğrulama işlemi sonrası şifreniz yeni bir e-posta ile gelecek olup gelen e-postadaki linke tıklayınız.<br><br>

                Teşekkürler, <br>  
                AICOOK Ekibi
        """
        isSendMail = send_mail(subject=subject, message="", html_message=message, from_email=settings.EMAIL_HOST_USER , recipient_list=[instance.email], fail_silently=False)

    def get_queryset(self):

        queryset = Babysitter.objects.all()
        parent_id = self.request.query_params.get('parentId')

        if parent_id:
            queryset = queryset.filter(parent=parent_id)

        return queryset