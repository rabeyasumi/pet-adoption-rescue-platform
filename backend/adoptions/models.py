from django.db import models
from django.conf import settings
from pets.models import Pet


class AdoptionRequest(models.Model):

    class RequestStatus(models.TextChoices):
        PENDING = "Pending", "Pending"
        APPROVED = "Approved", "Approved"
        REJECTED = "Rejected", "Rejected"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="adoption_requests"
    )
    pet = models.ForeignKey(
        Pet,
        on_delete=models.CASCADE,
        related_name="adoption_requests"
    )
    address = models.TextField()
    phone = models.CharField(max_length=20)
    reason = models.TextField()
    previous_pet_experience = models.BooleanField()
    message = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=RequestStatus.choices,
        default=RequestStatus.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.pet}"