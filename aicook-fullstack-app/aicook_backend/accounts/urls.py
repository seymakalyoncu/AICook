from django.urls import path
from .views import RegisterView, VerifyEmailView, BabysittersVerifyEmailView, PasswordResetRequestView, PasswordResetConfirmView, UserInfoView, UserChangeStatusView, UpdateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('verify-email/', VerifyEmailView.as_view()),
    path('babysitters/verify-email/', BabysittersVerifyEmailView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('request-reset/', PasswordResetRequestView.as_view()),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view()),
    path('userinfo', UserInfoView.as_view(), name='current-user'),
    path('user-change-status', UserChangeStatusView.as_view(), name='user-change-status'),
    path('updateUser/<int:uid>/', UpdateUserView.as_view(), name='update-user'),
]
