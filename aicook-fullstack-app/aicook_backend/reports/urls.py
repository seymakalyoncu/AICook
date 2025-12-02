from django.urls import path
from .views import (
    PhysicalDevelopmentList,
    TotalSleepList,
    TotalMealNutritiveList
)

urlpatterns = [
    path('physical-development/<int:child_id>/', PhysicalDevelopmentList.as_view()),
    path('total-sleep/<int:child_id>/', TotalSleepList.as_view()),
    path('total-meal-nutritive/<int:child_id>/', TotalMealNutritiveList.as_view()),
]
