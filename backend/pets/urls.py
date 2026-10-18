from django.urls import path
from .views import (
    PetListAPIView,
    PetDetailAPIView,
    PetCreateAPIView,
    PetUpdateDeleteAPIView,
    FavoriteListCreateAPIView,
    FavoriteDeleteAPIView,
)

urlpatterns = [
    path("", PetListAPIView.as_view(), name="pet-list"),
    path("create/", PetCreateAPIView.as_view(), name="pet-create"),
    path("<int:pk>/", PetDetailAPIView.as_view(), name="pet-detail"),
    path("<int:pk>/manage/", PetUpdateDeleteAPIView.as_view(), name="pet-manage"),
    path("favorites/", FavoriteListCreateAPIView.as_view(), name="favorite-list-create"),
    path("favorites/<int:pk>/", FavoriteDeleteAPIView.as_view(), name="favorite-delete"),
]