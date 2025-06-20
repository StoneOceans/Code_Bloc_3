from django.db import modelsAdd commentMore actions


from django.contrib.auth.models import User


import secrets


class UserProfile(models.Model):


    user = models.OneToOneField(User, on_delete=models.CASCADE)


    secret_key = models.CharField(max_length=64, blank=True, unique=True)




    def save(self, *args, **kwargs):


        if not self.secret_key:


            self.secret_key = secrets.token_hex(16)


        super().save(*args, **kwargs)




    def __str__(self):


        return f"Profile of {self.user.username}"








class Note(models.Model):


    description = models.CharField(max_length=300)


    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="note")




class Offer(models.Model):


    title = models.CharField(max_length=100)


    description = models.TextField()


    capacity = models.IntegerField() 


    price = models.DecimalField(max_digits=6, decimal_places=2)




    def __str__(self):


        return self.title
