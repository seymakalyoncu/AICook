import boto3
from django.conf import settings
from botocore.exceptions import ClientError

# S3 client oluştur
s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)

def upload_file_to_s3(file_obj, bucket_name, object_name):
    """
    Dosyayı S3'e yükler.
    :param file_obj: Dosya objesi (örn. request.FILES['file'])
    :param bucket_name: S3 bucket adı
    :param object_name: S3 üzerinde kaydedilecek isim
    :return: Dosyanın S3 URL'si veya hata mesajı
    """
    try:
        s3_client.upload_fileobj(file_obj, bucket_name, object_name)
        url = f"https://{bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{object_name}"
        return url
    except ClientError as e:
        print(e)
        return None
