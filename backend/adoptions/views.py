from django.shortcuts import get_object_or_404
from django.db import transaction

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import AdoptionRequest
from .serializers import AdoptionRequestSerializer
from pets.models import Pet


class AdoptionRequestListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AdoptionRequest.objects.filter(
            user=self.request.user
        ).select_related("pet").order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdoptionRequestDetailAPIView(generics.RetrieveAPIView):
    serializer_class = AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AdoptionRequest.objects.filter(
            user=self.request.user
        ).select_related("pet")


class AdminAdoptionRequestListAPIView(generics.ListAPIView):
    queryset = AdoptionRequest.objects.all().select_related(
        "user", "pet"
    ).order_by("-created_at")
    serializer_class = AdoptionRequestSerializer
    permission_classes = [IsAdminUser]


class AdminAdoptionDecisionAPIView(APIView):
    permission_classes = [IsAdminUser]

    @transaction.atomic
    def post(self, request, pk):
        adoption_request = get_object_or_404(
            AdoptionRequest.objects.select_for_update(),
            pk=pk,
        )

        decision = request.data.get("status")

        if decision not in [
            AdoptionRequest.RequestStatus.APPROVED,
            AdoptionRequest.RequestStatus.REJECTED,
        ]:
            return Response(
                {"detail": "Status must be Approved or Rejected."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if adoption_request.status != AdoptionRequest.RequestStatus.PENDING:
            return Response(
                {"detail": "This request has already been processed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pet = Pet.objects.select_for_update().get(
            pk=adoption_request.pet_id
        )

        if decision == AdoptionRequest.RequestStatus.APPROVED:
            if pet.status != Pet.AdoptionStatus.AVAILABLE:
                return Response(
                    {"detail": "This pet is no longer available."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            pet.status = Pet.AdoptionStatus.ADOPTED
            pet.save(update_fields=["status"])

            adoption_request.status = (
                AdoptionRequest.RequestStatus.APPROVED
            )

            AdoptionRequest.objects.filter(
                pet=pet,
                status=AdoptionRequest.RequestStatus.PENDING,
            ).exclude(pk=adoption_request.pk).update(
                status=AdoptionRequest.RequestStatus.REJECTED
            )

        else:
            adoption_request.status = (
                AdoptionRequest.RequestStatus.REJECTED
            )

        adoption_request.save(update_fields=["status"])

        return Response(
            AdoptionRequestSerializer(adoption_request).data,
            status=status.HTTP_200_OK,
        )