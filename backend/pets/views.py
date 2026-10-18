from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny

from rest_framework.permissions import IsAdminUser

from .models import Pet, Favorite
from .serializers import PetSerializer, FavoriteSerializer


class PetListAPIView(generics.ListAPIView):
    queryset = Pet.objects.all().order_by("-created_at")
    serializer_class = PetSerializer
    permission_classes = [AllowAny]

    filterset_fields = [
        "animal_type",
        "breed",
        "gender",
        "location",
        "status",
    ]

    search_fields = ["name", "breed", "description", "location"]
    ordering_fields = ["name", "age", "created_at"]

class PetDetailAPIView(generics.RetrieveAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [AllowAny]

class PetCreateAPIView(generics.CreateAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAdminUser]


class PetUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAdminUser]

class FavoriteListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(
            user=self.request.user
        ).select_related("pet")

    def perform_create(self, serializer):
        pet = serializer.validated_data["pet"]

        if pet.status != Pet.AdoptionStatus.AVAILABLE:
            raise ValidationError(
                {"pet": "Only available pets can be favorited."}
            )

        serializer.save(user=self.request.user)


class FavoriteDeleteAPIView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)