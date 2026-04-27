import jwt
import time
import boto3
import json
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer
from app.config import SECRET_KEY, ALGORITHM, READ_ROLE_ARN, WRITE_ROLE_ARN, S3_BUCKET, AWS_REGION

security = HTTPBearer()
sts = boto3.client("sts", region_name=AWS_REGION)

# 🔹 Fake admin login (replace with Cognito later)
ADMIN_EMAIL = "admin@fileshare.com"
ADMIN_PASSWORD = "password123"

def login(email: str, password: str):
    if email != ADMIN_EMAIL or password != ADMIN_PASSWORD:
        raise HTTPException(401, "Invalid credentials")

    payload = {
        "sub": email,
        "exp": int(time.time()) + 3600
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token=Depends(security)):
    try:
        decoded = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded
    except:
        raise HTTPException(401, "Invalid token")


# 🔹 STS AssumeRole
def assume_role(role_type, room_id):
    role_arn = READ_ROLE_ARN if role_type == "read" else WRITE_ROLE_ARN

    actions = ["s3:GetObject"]
    if role_type == "write":
        actions += ["s3:PutObject", "s3:DeleteObject"]

    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": actions,
                "Resource": f"arn:aws:s3:::{S3_BUCKET}/{room_id}/*"
            }
        ]
    }

    res = sts.assume_role(
        RoleArn=role_arn,
        RoleSessionName="fileshare-session",
        Policy=json.dumps(policy),
        DurationSeconds=3600
    )

    return res["Credentials"]