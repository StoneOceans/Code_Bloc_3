from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework import status
from .models import Note, Offer, Purchase, UserProfile
import secrets
from .serializer import NoteSerializer, UserRegisterSerializer , UserSerializer, OfferSerializer, PurchaseSerializer
# Create your views here.
from django.shortcuts import get_object_or_404
from io import BytesIO
import base64
import qrcode
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import(
    TokenObtainPairView,
    TokenRefreshView,
)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def register(request):
    try:
        data = request.data
        required_fields = ['username', 'email', 'password']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return Response({
                "success": False,
                "error": f"Missing required fields: {', '.join(missing_fields)}",
                "missing_fields": missing_fields
            }, status=status.HTTP_400_BAD_REQUEST)
        empty_fields = [field for field in required_fields if not data.get(field)]
        if empty_fields:
            return Response({
                "success": False,
                "error": f"Fields cannot be empty: {', '.join(empty_fields)}",
                "empty_fields": empty_fields
            }, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserRegisterSerializer(data=data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "error": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        response_data = {
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }
        response = Response(response_data, status=status.HTTP_201_CREATED)
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            secure=False,
            samesite='Lax',
            path='/'
        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite='Lax',
            path='/'
        )
        return response
    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            seriliazer = UserSerializer(request.user, many=False)

            res = Response()

            res.data = {'success':True}

            res.set_cookie(
                key='access_token',
                value=str(access_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key='refresh_token',
                value=str(refresh_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            res.data.update(tokens)
            return res
        
        except Exception as e:
            return Response({'success': False}, status=401)

        
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            
            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='None',
                path='/'
            )
            return res

        except Exception as e:
            print(e)
            return Response({'refreshed': False})


# views.py
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()

        response = Response({'success': True})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_status(request):
    return Response({
        'is_admin': request.user.is_staff or request.user.is_superuser
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def is_authenticated(request):
    return Response({'authenticated': request.user.is_authenticated})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notes(request):
    user = request.user
    notes = Note.objects.filter(owner=user)
    serializer = NoteSerializer(notes,many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def get_offers(request):
    if request.method == 'GET':
        offers = Offer.objects.all()
        serializer = OfferSerializer(offers, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = OfferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_purchase(request):
    cart_items = request.data.get('cart', [])
    second_key = secrets.token_hex(16)
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    final_key = user_profile.secret_key + second_key
    purchase = Purchase.objects.create(
        user=request.user,
        items=str(cart_items),
        final_key=final_key
    )
    qr = qrcode.make(final_key)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    qr_code = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return Response({
        "message": "Achat réussi",
        "purchase_id": purchase.id,
        "final_key": final_key,
        "ticket": qr_code
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_purchase(request):
    cart_items = request.data.get('cart', [])
    second_key = secrets.token_hex(16)
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    final_key = user_profile.secret_key + second_key
    purchase = Purchase.objects.create(
        user=request.user,
        items=str(cart_items),
        final_key=final_key
    )
    qr = qrcode.make(final_key)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    qr_code = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return Response({
        "message": "Achat réussi",
        "purchase_id": purchase.id,
        "final_key": final_key,
        "ticket": qr_code
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    orders = Purchase.objects.filter(user=request.user).order_by("-created_at")
    serializer = PurchaseSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def offer_detail(request, pk):
    try:
        offer = get_object_or_404(Offer, pk=pk)
        offer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        # return the exception text so you see it in the browser
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
