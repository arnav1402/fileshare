import boto3
from app.config import S3_BUCKET, AWS_REGION

s3 = boto3.client("s3", region_name=AWS_REGION)

def generate_upload_url(key):
    return s3.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": S3_BUCKET,
            "Key": key,
            "ContentType": "application/octet-stream",  # default
        },
        ExpiresIn=3600
    )

def generate_download_url(key):
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": S3_BUCKET, "Key": key},
        ExpiresIn=3600
    )

def upload_file_to_s3(key, file_content):
    """Upload file directly to S3 from backend (avoids CORS issues)"""
    try:
        s3.put_object(
            Bucket=S3_BUCKET,
            Key=key,
            Body=file_content,
            ContentType="application/octet-stream"
        )
        return True
    except Exception as e:
        raise Exception(f"S3 upload failed: {str(e)}")