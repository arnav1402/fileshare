import boto3
from app.config import S3_BUCKET, AWS_REGION

s3 = boto3.client("s3", region_name=AWS_REGION)

def generate_upload_url(room_id, filename, content_type):
    return s3.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": S3_BUCKET,
            "Key": f"{room_id}/{filename}",
            "ContentType": content_type
        },
        ExpiresIn=3600
    )

def generate_download_url(key):
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": S3_BUCKET, "Key": key},
        ExpiresIn=3600
    )