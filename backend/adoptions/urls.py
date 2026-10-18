from django.urls import path
from .views import (
    AdoptionRequestListCreateAPIView,
    AdoptionRequestDetailAPIView,
    AdminAdoptionRequestListAPIView,
    AdminAdoptionDecisionAPIView,
)

urlpatterns = [
    path("", AdoptionRequestListCreateAPIView.as_view(), name="adoption-list-create"),
    path("<int:pk>/", AdoptionRequestDetailAPIView.as_view(), name="adoption-detail"),
    path("admin/requests/", AdminAdoptionRequestListAPIView.as_view(), name="admin-adoption-list"),
    path("admin/requests/<int:pk>/decision/", AdminAdoptionDecisionAPIView.as_view(), name="admin-adoption-decision"),
]