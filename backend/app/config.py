import os
from dotenv import load_dotenv

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET = os.getenv("S3_BUCKET")
print(AWS_REGION)

READ_ROLE_ARN = os.getenv("READ_ROLE_ARN")
WRITE_ROLE_ARN = os.getenv("WRITE_ROLE_ARN")

DYNAMO_TABLE = os.getenv("DYNAMO_TABLE")

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = "HS256"