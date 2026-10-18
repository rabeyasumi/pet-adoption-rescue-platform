from rest_framework import serializers
from .models import AdoptionRequest
from pets.models import Pet


class AdoptionRequestSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(source="pet.name", read_only=True)

    class Meta:
        model = AdoptionRequest
        fields = [
            "id",
            "pet",
            "pet_name",
            "address",
            "phone",
            "reason",
            "previous_pet_experience",
            "message",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_pet(self, pet):
        if pet.status != Pet.AdoptionStatus.AVAILABLE:
            raise serializers.ValidationError(
                "This pet is not available for adoption."
            )

        user = self.context["request"].user

        existing_request = AdoptionRequest.objects.filter(
            user=user,
            pet=pet,
            status=AdoptionRequest.RequestStatus.PENDING,
        ).exists()

        if existing_request:
            raise serializers.ValidationError(
                "You already have a pending request for this pet."
            )

        return pet