# base/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.register, name='register'),
    path('tokens/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout, name='logout'),
    path('authenticated/', views.is_authenticated, name='is_authenticated'),
    path('is-admin/', views.admin_status, name='is_admin'),

    # Notes
    path('notes/', views.get_notes, name='get_notes'),

    # Offers
    path('offers/', views.get_offers, name='get_offers'),
    path('offers/<int:pk>/', views.offer_detail, name='offer_detail_no_slash'),

    


    # Purchases
    path('purchase/', views.make_purchase, name='make_purchase'),
    path('create_purchase/', views.create_purchase, name='create_purchase'),
    path('orders/', views.get_orders, name='get_orders'),
]
