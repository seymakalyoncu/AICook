from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode #, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'is_staff', 'is_superuser' , 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):

        user = User.objects.create_user(**validated_data, is_active=False)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        activation_link = f"http://localhost:3000/authentication/verify-email?uid={uid}&token={token}"

        subject = "AICOOK Email Doğrulama"
        message = f"""
                Merhaba {user.first_name} {user.last_name}, <br><br>

                Sitemize kayıt olduğunuz için teşekkür ederiz. <br><br>
                
                Hesabınızı aktifleştirmek için lütfen aşağıdaki bağlantıya tıklayarak e-posta adresinizi doğrulayın: <br><br>

                E-posta adresinizi doğrulamak için <a href="{activation_link}">tıklayınız.</a> <br><br><br>
                """
        if user.is_staff:
           message +=f"<p>Bakıcı kaydı için oluşturulan şifreniz: {validated_data['password']}</p>"
        from_mail = settings.EMAIL_HOST_USER                

        message +=f"""  Eğer bu işlemi siz gerçekleştirmediyseniz, lütfen bu e-postayı dikkate almayınız. <br><br>

                Teşekkürler, <br>  
                AICOOK Ekibi
                """

        isSendMail = send_mail(subject=subject, message="", html_message=message, from_email=from_mail , recipient_list=[user.email], fail_silently=False)
        return user
