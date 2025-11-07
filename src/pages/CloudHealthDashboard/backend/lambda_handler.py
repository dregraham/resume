import random
import json

def lambda_handler(event=None, context=None):
    services = ['EC2', 'S3', 'DynamoDB', 'Lambda', 'CloudWatch']
    results = []
    for svc in services:
        results.append({
            'name': svc,
            'status': random.choice(['Healthy', 'Degraded', 'Down'])
        })
    return {'services': results}

if __name__ == '__main__':
    print(json.dumps(lambda_handler(), indent=2))
