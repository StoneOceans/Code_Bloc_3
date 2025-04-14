from django.urls import path
from .views import get_notes, CustomTokenObtainPairView,CustomTokenRefreshView, logout, is_authenticated, register, get_offers, make_purchase
from django.views.generic import TemplateView
from django.urls import re_path

urlpatterns = [
    path('tokens/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('notes/', get_notes),
    path('logout/', logout),
    path('authenticated/', is_authenticated),
    path('register/', register),
    path('offers/', get_offers, name='offers'),
    path('purchase/', make_purchase, name='make_purchase'),
]