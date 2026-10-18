from django.db import models
from django.conf import settings


class Pet(models.Model):

    class AnimalType(models.TextChoices):
        DOG = "Dog", "Dog"
        CAT = "Cat", "Cat"
        BIRD = "Bird", "Bird"
        RABBIT = "Rabbit", "Rabbit"
        OTHER = "Other", "Other"

    class Gender(models.TextChoices):
        MALE = "Male", "Male"
        FEMALE = "Female", "Female"

    class AdoptionStatus(models.TextChoices):
        AVAILABLE = "Available", "Available"
        ADOPTED = "Adopted", "Adopted"

    name = models.CharField(max_length=100)
    animal_type = models.CharField(
        max_length=20,
        choices=AnimalType.choices
    )
    breed = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(
        max_length=10,
        choices=Gender.choices
    )
    location = models.CharField(max_length=150)
    description = models.TextField()
    image = models.ImageField(
        upload_to="pets/",
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=20,
        choices=AdoptionStatus.choices,
        default=AdoptionStatus.AVAILABLE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorite_pets"
    )
    pet = models.ForeignKey(
        Pet,
        on_delete=models.CASCADE,
        related_name="favorited_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "pet"],
                name="unique_user_favorite_pet"
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.pet}"