from django.db import models
from django.contrib.auth.models import User

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