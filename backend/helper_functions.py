import json
from geopy.distance import geodesic
from django.http import JsonResponse
from commuter.models import Rides
import boto3
from botocore.exceptions import NoCredentialsError
import requests
import re
import apikey


'''
Stock Username and Password:
Username: Collin_Shill
Password: 1234
'''


def parse_locations(locations_str):
    locations_list = json.loads(locations_str)
    return [tuple(location) for location in locations_list]


def check_image(image_url):

    api_key = apikey.api_key

    prompt = """
    Carefully analyze the provided photo.
    Determine whether there is an object that can be clearly identified as a bus, 
    considering its size, shape, and distinguishing features typical of a bus. 
    Ignore other large vehicles such as trucks or vans. 
    Respond with 'True' if a bus is definitely present and 'False' if there is no bus or if you are unsure.
    """
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url,
                            "detail": "low"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    return response.json()["choices"][0]["message"]["content"]



def verify_location(user_location, specific_locations, threshold=0.5):
    try:
        for location in specific_locations:
            distance = geodesic(user_location, location).miles
            if distance < threshold:  
                return True

    except Exception as e:
        return False

    return False


# Get all rides of a user
def get_user_rides(request, user_id):
    rides = Rides.objects.filter(user_id=user_id)
    rides_list = list(rides.values('profile_url', 'selfie_url', 'date_time', 'caption'))
    return JsonResponse(rides_list, safe=False)


def parse_location(location_str):
    # Remove the parentheses and split the string on the comma
    parts = location_str.strip("()").split(",")
    # Convert each part to a float and return as a tuple
    return tuple(float(part) for part in parts)


