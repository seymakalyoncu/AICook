import uuid
import boto3
from django.conf import settings
from botocore.exceptions import ClientError


s3_client = boto3.client(
    "s3",
    region_name=settings.AWS_REGION
)


def upload_file_to_s3(file_obj, user_id):
    """
    Dosyayı S3'e yükler ve public URL döner
    """
    try:
        file_extension = file_obj.name.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_extension}"

        object_name = f"fridge-photos/user_{user_id}/{file_name}"

        s3_client.upload_fileobj(
            file_obj,
            settings.AWS_BUCKET_NAME,
            object_name,
            ExtraArgs={
                "ContentType": file_obj.content_type
            }
        )

        url = f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{object_name}"
        return url

    except ClientError as e:
        print("S3 upload error:", e)
        return None
