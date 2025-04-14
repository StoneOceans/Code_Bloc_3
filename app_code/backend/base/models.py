from django.db import models
from django.contrib.auth.models import User
import secrets

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    secret_key = models.CharField(max_length=64, blank=True, unique=True)

    def save(self, *args, **kwargs):
        # Generate a random hex key if none exists
        if not self.secret_key:
            self.secret_key = secrets.token_hex(16)  # 32-hex chars
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Profile of {self.user.username}"


class Note(models.Model):
    description = models.CharField(max_length=300)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="note")

class Offer(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    capacity = models.IntegerField()  # 1 pour solo, 2 pour duo, 4 pour familiale
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.title

class Purchase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.TextField()  # or JSONField if you prefer, storing cart items
    final_key = models.CharField(max_length=128, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Purchase #{self.id} by {self.user.username}"
