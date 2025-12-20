from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

from .models import FridgePhotos
from services.s3_service import upload_file_to_s3


class FridgePhotoUploadView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_obj = request.FILES.get("file")
        description = request.data.get("description")

        if not file_obj:
            return Response(
                {"error": "Dosya gönderilmedi."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ DOĞRU ÇAĞRI (3 PARAMETRE)
        s3_url = upload_file_to_s3(
            file_obj,
            settings.AWS_BUCKET_NAME,
            file_obj.name
        )

        if not s3_url:
            return Response(
                {"error": "Dosya yüklenemedi."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        photo = FridgePhotos.objects.create(
            user=request.user,
            url=s3_url,
            description=description
        )

        return Response(
            {
                "id": photo.id,
                "url": photo.url,
                "description": photo.description
            },
            status=status.HTTP_201_CREATED
        )
