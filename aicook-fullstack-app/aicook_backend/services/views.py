from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from services.s3_service import upload_file_to_s3
from django.conf import settings

class UploadFileView(APIView):
    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "Dosya gönderilmedi."}, status=status.HTTP_400_BAD_REQUEST)
        
        s3_url = upload_file_to_s3(file_obj, settings.AWS_BUCKET_NAME, file_obj.name)
        if s3_url:
            return Response({"url": s3_url}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Dosya yüklenemedi."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
