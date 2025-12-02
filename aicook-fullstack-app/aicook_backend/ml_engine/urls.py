from django.urls import path
from .views import child_percentile_view, meal_recommendation, predict_writing

urlpatterns = [
    path('child/<int:child_id>/percentile/', child_percentile_view, name='child-percentile'),
    path('child/<int:child_id>/meal-recommendation/', meal_recommendation, name='child-meal-recommendation'),
    path('child/<int:child_id>/writing-prediction/', predict_writing, name='child-writing-prediction'),
]
