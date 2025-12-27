from django.urls import path
from .views import (HistoryCategoryList, HistoryDateList, HistoryIngredientList, HistoryRatingList)

urlpatterns = [
    path('history_category/<int:user_id>/', HistoryCategoryList.as_view()),
    path('history_date/<int:user_id>/', HistoryDateList.as_view()),
    path('history_ingredient/<int:user_id>/', HistoryIngredientList.as_view()),
    path('history_rating/<int:user_id>/', HistoryRatingList.as_view()),
]
