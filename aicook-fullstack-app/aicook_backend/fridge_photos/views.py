import requests
import tempfile
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.models import Users
from django.conf import settings
from .models import FridgePhotos
from .services.s3_service import upload_file_to_s3, generate_presigned_url
from fridge_photos.services.photo_analysis import analyze_photo
from .yolo.detect import detect_ingredients


class FridgePhotoUploadView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_obj = request.FILES.get("file")
        description = request.data.get("description")

        user = request.user

        if not file_obj:
            return Response(
                {"error": "Dosya gönderilmedi."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        s3_url = upload_file_to_s3(file_obj, user.id)
        
        if not s3_url:
            return Response(
                {"error": "Dosya yüklenemedi."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        photo = FridgePhotos.objects.create(
            user=Users.objects.get(id=user.id),
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


class FridgePhotoListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.auth.get("user_id")

        user = Users.objects.get(id=user_id)

        photos = FridgePhotos.objects.filter(user=user).order_by("-create_date")

        return Response(
            [
                {
                    "id": photo.id,
                    "url": generate_presigned_url(photo.url),
                    "create_date": photo.create_date,  # 👈 EKLENDİ
                }
                for photo in photos
            ],
            status=status.HTTP_200_OK
        )
    
class AnalyzePhotoView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, photo_id):
        try:
            photo = FridgePhotos.objects.get(
                id=photo_id,
                user_id=request.user.id
            )
        except FridgePhotos.DoesNotExist:
            return Response(
                {"error": "Fotoğraf bulunamadı"},
                status=404
            )

        detections = analyze_photo(photo.url)

        return Response({
            "ingredients": detections
        })