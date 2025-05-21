from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Offer, Note, Purchase
from django.contrib.auth.password_validation import validate_password
import secrets
import qrcode
import base64
from io import BytesIO

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,

        min_length=8,
        style={'input_type': 'password'}
    )
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'username': {'min_length': 4, 'max_length': 30},
        }

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate_password(self, value):
        validate_password(value, user=None)
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
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

class PurchaseSerializer(serializers.ModelSerializer):
    ticket = serializers.SerializerMethodField()
    type_ticket = serializers.SerializerMethodField()

    class Meta:
        model = Purchase
        fields = ['id', 'items', 'final_key', 'created_at', 'ticket', 'type_ticket']

    def get_ticket(self, obj):
        buffer = BytesIO()
        img = qrcode.make(obj.final_key)
        img.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode('utf-8')

    def get_type_ticket(self, obj):
        try:
            items = obj.items  
            if isinstance(items, str):
                items = json.loads(items)
            if isinstance(items, list) and len(items) > 0:
                const = items[0].get("capacity")
                if const == 1:
                    return "Ticket Solo"
                elif const == 2:
                    return "Ticket Duo"
                elif const == 4:
                    return "Ticket Familial"
                else:
                    return "Ticket personnalisé"
            else:
                return "Ticket personallisé"
        except Exception as e:
            return "Ticket personallisé"