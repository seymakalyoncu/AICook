from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from utils.token import verify_token
from .serializers import RegisterSerializer
from users.serializers import UsersSerializer
from users.models import Users
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime
import random
import string

class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    def post(self, request):

        full_data = request.data.copy()
 
        # User ['username', 'first_name', 'last_name', 'is_staff', 'is_superuser',  'email', 'password']

        user_data = {
            'username' : full_data.get('username'),
            'first_name' : full_data.get('first_name'),
            'last_name' : full_data.get('last_name'),
            'is_staff' : full_data.get('is_staff'),
            'is_superuser' : full_data.get('is_superuser'),
            'email' : full_data.get('email'),
            'password' : full_data.get('password'),
        }

        print(user_data)

        birthDate_str = full_data.get('birthDate')
        birthDate = datetime.strptime(birthDate_str, f'%Y-%m-%d').date()

        users_data = {
            'name' : full_data.get('first_name'),
            'surname' : full_data.get('last_name'),
            'email' : full_data.get('email'),
            'gender' : full_data.get('gender'),
            'birth_day' : birthDate.day,
            'birth_month' : birthDate.month,
            'birth_year' : birthDate.year,
            'user_id': 0
        }

        userSerializer = RegisterSerializer(data=user_data)
        if userSerializer.is_valid(raise_exception=False):
            user = userSerializer.save()
            users_data['user_id'] = user.id

            usersSerializer = UsersSerializer(data=users_data)
            if usersSerializer.is_valid(raise_exception=False):
                users = usersSerializer.save()
                return Response({"msg": f"Kayıt başarılı. {user.email} e-mail adresine gönderilen doğrulama işlemini yapınız."}, status=201)
            return Response(usersSerializer.errors, status=400)

        return Response(userSerializer.errors, status=400)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        uid = request.GET.get("uid")
        token = request.GET.get("token")
        user_id = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=user_id)
        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"msg": "Email doğrulandı"}, status=200)
        return Response({"error": "Geçersiz bağlantı"}, status=400)

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):

        # user_id = request.query_params.get('user_id')
        user = request.user
        # users = User.objects.get(user_id = user.id)
        response = {
            "id": user.id,
            "user_id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_active": user.is_active
        }
                      
        return Response(response)
    
class UserChangeStatusView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):

        user_id = request.query_params.get('user_id')
        status = request.query_params.get('status')
        response = {}

        if user_id:
            user_data = User.objects.get(id = user_id)
            user_data.is_active = status
            userSerializer = RegisterSerializer(user_data, data={"is_active": status}, partial=True)
            if userSerializer.is_valid(raise_exception=False):
                user = userSerializer.save()
                # print(user)
                response = {
                                "id": user.id,
                                "email": user.email,
                                "is_active": user.is_active
                            }


        return Response(response)

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email, username=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            activation_link = f"http://localhost:3000/authentication/reset-password-confirm?uid={uid}&token={token}"

            subject = "AICOOK Şifre Yenileme"
            message = f"""
            Merhaba {user.first_name} {user.last_name}, <br><br>

            Şifre yenileme isteğiniz başarıyla alınmıştır. Tamamlamak için aşağıdaki linke tıkalayarak yeni şifrenizi oluşturabilirsiniz. <br><br>
            
            Şifre yenilemek için <a href="{activation_link}">tıklayınız.</a> <br><br><br>
            
            Eğer bu işlemi siz gerçekleştirmediyseniz, lütfen bu e-postayı dikkate almayınız. <br><br>

            Teşekkürler, <br>  
            AICOOK Ekibi
            """

            from_mail = settings.EMAIL_HOST_USER    

            isSendMail = send_mail(subject=subject, message="", html_message=message, from_email=from_mail , recipient_list=[user.email], fail_silently=False)
            if isSendMail>0:
                return Response({"msg": "E-posta gönderildi"}, status=200)
            else:
                return Response({"msg": "E-posta gönderilemedi."}, status=400)
            
        except User.DoesNotExist:
            return Response({"error": "Email bulunamadı"}, status=404)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")
        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                
                return Response({"msg": "Şifre başarıyla değiştirildi"}, status=200)
            return Response({"error": "Geçersiz token"}, status=400)
        except Exception as e:
            return Response({"error": "Hata oluştu"}, status=400)

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request, uid):
        try:
            user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            return Response({"error": "Kullanıcı bulunamadı"}, status=status.HTTP_404_NOT_FOUND)

        password = request.data.get('password')
        if password:
            user.set_password(password)
            user.save()
            return Response({"msg": "Şifre başarıyla güncellendi"}, status=status.HTTP_200_OK)

        serializer = RegisterSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Kullanıcı güncellendi", "user": serializer.data}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
