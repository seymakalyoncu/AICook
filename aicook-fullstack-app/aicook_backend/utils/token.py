from itsdangerous import URLSafeSerializer, BadSignature, SignatureExpired
from django.conf import settings

SECRET_KEY = settings.SECRET_KEY
SALT = 'cok-gizli@bir-sifre'

serializer = URLSafeSerializer(SECRET_KEY)

def generate_token(data: str) -> str:
    return serializer.dumps(data, salt=SALT)

def verify_token(token:str, max_age: int = 3600) -> str:
    try:
        data = serializer.loads(token, salt=SALT, max_age=max_age)
        return data
    except SignatureExpired:
        raise ValueError("Token süresi dolmuş")
    except BadSignature:
        raise ValueError("Token geçersiz")

        
