from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from geopy.distance import geodesic
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from .models import Rides, BusRoute, Users
from helper_functions import parse_locations, check_image, verify_location, parse_location
import json
from django.http import JsonResponse
from .models import Rides, Users, Sponsors


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'status': 'success'})  # Successful login
        else:
            return JsonResponse({'status': 'invalid_login'})  # Invalid form data
    else:
        return JsonResponse({'status': 'post_required'})  # POST request required


@csrf_exempt
def create_ride(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        date_time = data.get('date_time')
        bus_id = data.get('bus_id')
        user_id = data.get('user_id')
        bus_url = data.get('bus_url')
        selfie_url = data.get('selfie_url')
        user_location = data.get('location')
        user_location = parse_location(user_location)
        caption = data.get('caption')

        try:
            bus_route = BusRoute.objects.get(bus_id=bus_id)
        except BusRoute.DoesNotExist:
            return JsonResponse({'status': 'invalid_bus_id'})

        locations = parse_locations(bus_route.locations)
        
        if not verify_location(user_location, locations):
            return JsonResponse({'status': 'Location verification failed'})

        check = check_image(bus_url)
        # check = True
        
        if not check:
            return JsonResponse({'status': 'Image verification failed'})

        Rides.objects.create(
            date_time=date_time,
            bus_id=bus_id,
            user_id=user_id,
            bus_url=bus_url,
            selfie_url=selfie_url,
            caption=caption,
        )
        return JsonResponse({'status': 'ride_created'})

    else:
        return JsonResponse({'status': 'post_required'})


@csrf_exempt
@require_http_methods(["GET"])
def home_screen(request, user_id):
    user = Users.objects.get(user_id=user_id)
    rides = Rides.objects.filter(user_id=user_id).values('date_time', 'selfie_url', 'caption')
    
    response = []
    for ride in rides:
        response.append({
            'name': user.name,
            'profile_url': user.profile_url,
            'date_time': ride['date_time'],
            'selfie_url': ride['selfie_url'],
            'caption': ride['caption'],
        })
    
    return JsonResponse(response, safe=False)


@csrf_exempt
@require_http_methods(["GET"])
def user_profile(request, user_id):
    # Get the user
    user = Users.objects.get(user_id=user_id)

    # Get the rides for the user
    rides = Rides.objects.filter(user_id=user_id)

    # Calculate the points
    points = rides.count() * 10

    # Get the ride dates
    ride_dates = [ride.date_time.strftime('%Y-%m-%d') for ride in rides]

    # Prepare the data
    data = {
        'name': user.name,
        'profile_url': user.profile_url,
        'points': points,
        'ride_dates': ride_dates,
    }

    # Return a JSON response
    return JsonResponse(data)

@csrf_exempt
@require_http_methods(["GET"])
def redeem_page(request):
    # Get all sponsors from the Sponsor table
    sponsors = Sponsors.objects.all().values('sponsor_name', 'sponsor_logo', 'sponsor_url', 'redeem_cost')

    # Convert the QuerySet to a list so it can be serialized to JSON
    sponsors_list = list(sponsors)

    # Return a JSON response
    return JsonResponse(sponsors_list, safe=False)



'''
query by user_id
jsonresponse: user, date_time, photo


'''


'''
table for coupons:

photo_url
name of firm/sponsor
points required

ALSO get aggregate points by getting number of rides by user_id then multiplying by 5
'''


# import json
# from .models import BusRoute  # replace 'myapp' with the name of your app

# locations = [(1, 2), (3, 4)]
# locations_str = json.dumps(locations)

# BusRoute.objects.create(bus_id='0', route_name='UVX', locations=locations_str)

