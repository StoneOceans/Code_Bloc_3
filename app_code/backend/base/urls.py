from django.urls import path
from .views import get_notes, CustomTokenObtainPairView,CustomTokenRefreshView, logout

urlpatterns = [
    path('tokens/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('notes/', get_notes),
    path('logout/', logout),
]