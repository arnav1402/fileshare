import jwt
import time
import boto3
import json
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import SECRET_KEY, ALGORITHM, READ_ROLE_ARN, WRITE_ROLE_ARN, S3_BUCKET, AWS_REGION, ACCESS_TOKEN_EXPIRE_SECONDS

security = HTTPBearer()
sts = boto3.client("sts", region_name=AWS_REGION)

# 🔹 Fake admin login (replace with Cognito later)
ADMIN_EMAIL = "admin@fileshare.com"
ADMIN_PASSWORD = "password123"


def login(email: str, password: str):
    # 🔥 Replace with DB later
    if email != "admin@fileshare.com" or password != "password123":
        raise HTTPException(status_code=401, detail="Invalid credentials")

    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


# 🔍 Verify JWT token
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # contains "sub" (email)

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def assume_role(role: str, room_id: str):
    """Assume a role and return temporary credentials"""
    role_arn = READ_ROLE_ARN if role == "read" else WRITE_ROLE_ARN
    
    if not role_arn:
        raise HTTPException(status_code=500, detail="Role ARN not configured")
    
    try:
        response = sts.assume_role(
            RoleArn=role_arn,
            RoleSessionName=f"fileshare-{role}-{room_id}",
            DurationSeconds=3600
        )
        
        credentials = response["Credentials"]
        return {
            "access_key": credentials["AccessKeyId"],
            "secret_key": credentials["SecretAccessKey"],
            "session_token": credentials["SessionToken"],
            "expiration": str(credentials["Expiration"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to assume role: {str(e)}")


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