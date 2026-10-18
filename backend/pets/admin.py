from django.contrib import admin
from .models import Pet, Favorite

admin.site.register(Pet)
admin.site.register(Favorite)