from django.urls import path
from home.controllers.home_controller import home

urlpatterns = [ 
    path('', home, name='home')
]