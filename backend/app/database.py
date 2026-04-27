import boto3
from app.config import DYNAMO_TABLE, AWS_REGION

dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
table = dynamodb.Table(DYNAMO_TABLE)

def save_room(item):
    table.put_item(Item=item)

def get_room(room_id):
    res = table.get_item(Key={"room_id": room_id})
    return res.get("Item")