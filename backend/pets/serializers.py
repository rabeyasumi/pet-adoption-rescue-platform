from rest_framework import serializers
from .models import Pet, Favorite


class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = "__all__"


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ["id", "pet", "created_at"]
        read_only_fields = ["id", "created_at"]