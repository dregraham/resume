import json
import boto3
import os
from datetime import datetime
from botocore.exceptions import ClientError

# Initialize DynamoDB resource
dynamodb = boto3.resource("dynamodb")
table_name = os.environ.get("DDB_TABLE", "environment_lifecycle")
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    """
    Lambda function that:
    - Accepts POST requests to log environment creation or destruction events
    - Accepts GET requests to list all recorded environments
    """

    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")
    path = event.get("requestContext", {}).get("http", {}).get("path", "/")

    try:
        if method == "POST":
            # Parse the request body
            body = json.loads(event.get("body", "{}"))
            env_id = body.get("environmentId", f"env-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}")
            status = body.get("status", "Active")
            region = body.get("region", "us-east-2")

            # Insert record into DynamoDB
            table.put_item(
                Item={
                    "environmentId": env_id,
                    "region": region,
                    "status": status,
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )

            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps(
                    {"message": "Environment recorded successfully", "environmentId": env_id}
                ),
            }

        elif method == "GET":
            # Retrieve all environment lifecycle records
            response = table.scan()
            items = response.get("Items", [])

            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps(items),
            }

        else:
            # Unsupported method
            return {
                "statusCode": 405,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": f"Method {method} not allowed"}),
            }

    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "DynamoDB operation failed", "details": str(e)}),
        }

    except Exception as e:
        print(f"General Error: {e}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Unexpected error occurred", "details": str(e)}),
        }
