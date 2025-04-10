from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Offer, Note
import secrets


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'username': {'min_length': 4, 'max_length': 30},
            'email': {'required': True}
        }

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Create UserProfile
        secret_key = secrets.token_hex(16)
        UserProfile.objects.create(user=user, secret_key=secret_key)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']


class NoteSerializer(serializers.ModelSerializer):

    class Meta:
        model=Note
        fields=['id','description']

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ['id', 'title', 'description', 'capacity', 'price']

