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
    describe what you see in the image
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


# def parse_scores(input_string):
#     cleanliness_score = re.search(r"Cleanliness Score: (\d+)", input_string)
#     clutter_score = re.search(r"Clutter Score: (\d+)", input_string)

#     if cleanliness_score and clutter_score:
#         return int(cleanliness_score.group(1)), int(clutter_score.group(1))
#     else:
#         return None, None


def verify_location(user_location, specific_locations, threshold=0.5):
    try:
        for location in specific_locations:
            distance = geodesic(user_location, location).miles  # You can change 'miles' to 'km' if you prefer kilometers
            if distance < threshold:  # Replace 'threshold' with the maximum distance you consider to be 'close'
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


# from django.http import JsonResponse
# from .models import BusRoute

# def view_bus_routes(request):
#     bus_routes = BusRoute.objects.all()
#     bus_routes_list = list(bus_routes.values())
#     return bus_routes_list

