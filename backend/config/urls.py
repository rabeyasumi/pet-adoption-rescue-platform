from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/pets/", include("pets.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("api/adoptions/", include("adoptions.urls")),
]
