from django.urls import path, include
from . import views

# URLConf for 'commuter' app
urlpatterns = [
    path('loc_verification/', views.verify_location, name='verify_location'),  # Verify location
    path('login/', views.login_view, name='login_view'),  # Login
    path('rides/', views.create_ride, name='verify_rides'),  # Rides
    path('home/<str:user_id>/', views.home_screen, name='home_screen'),  # Home screen
    path('account/<str:user_id>/', views.user_profile, name='user_profile'),
    path('redeem/', views.redeem_page, name='redeem'),
]

# Table to store user metrics (e.g. number of times they've been close to a verified location)


# POST request of the bus id, the user id, the day of the scan, the number of scans total

# rides Table

# verify 