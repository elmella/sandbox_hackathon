from django.db import models
from django.utils import timezone

class Rides(models.Model):
    user_id = models.CharField(max_length=200, verbose_name="User ID")
    bus_id = models.CharField(max_length=200, verbose_name="Bus ID")
    date_time = models.DateTimeField(default=timezone.now, verbose_name="Date and Time")
    bus_url = models.URLField(verbose_name="Bus Photo URL")
    selfie_url = models.URLField(verbose_name="Selfie Photo URL")
    caption = models.CharField(max_length=200, default='', verbose_name="Caption")

    class Meta:
        verbose_name = "Ride"
        verbose_name_plural = "Rides"
        ordering = ['-date_time']

    def __str__(self):
        return f"{self.user_id} - {self.bus_id}"


class BusRoute(models.Model):
    bus_id = models.CharField(max_length=200, primary_key=True, verbose_name="Bus ID")
    route_name = models.CharField(max_length=200, verbose_name="Route Name")
    locations = models.TextField(verbose_name="Locations")

    class Meta:
        verbose_name = "Bus Route"
        verbose_name_plural = "Bus Routes"

    def __str__(self):
        return f"{self.route_name} - {self.bus_id}"
    

class Users(models.Model):
    user_id = models.CharField(max_length=200, verbose_name="User ID")
    name = models.CharField(max_length=200, verbose_name="Name")
    profile_url = models.URLField(verbose_name="Photo URL")

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.user_id} - {self.profile_url}"
    
    
    from django.db import models
    

class Sponsors(models.Model):
    sponsor_name = models.CharField(max_length=200, verbose_name="Sponsor Name")
    sponsor_logo = models.URLField(verbose_name="Sponsor Logo URL")
    sponsor_url = models.URLField(verbose_name="Sponsor URL")
    redeem_cost = models.IntegerField(verbose_name="Redeem Cost")

    class Meta:
        verbose_name = "Sponsor"
        verbose_name_plural = "Sponsors"

    def __str__(self):
        return self.sponsor_name

