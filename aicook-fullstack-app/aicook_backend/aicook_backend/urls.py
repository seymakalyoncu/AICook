"""
URL configuration for aicook_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('', include('home.urls')),
    path('api/', include('articles.urls')),
    path('api/', include('cities.urls')),
    path('api/', include('districts.urls')),
    path('api/', include('meal_times.urls')),
    path('api/', include('sleep_quality_states.urls')),
    path('api/', include('education_states.urls')),
    path('api/', include('nationalities.urls')),
    path('api/', include('genders.urls')),
    path('api/', include('parents.urls')),
    path('api/', include('children.urls')),
    path('api/', include('meal_records.urls')),
    path('api/', include('disease_types.urls')),
    path('api/', include('health_records.urls')),
    path('api/', include('sleep_records.urls')),
    path('api/', include('physical_development_records.urls')),
    path('api/', include('cognitive_development_types.urls')),
    path('api/', include('development_states.urls')),
    path('api/', include('cognitive_development_records.urls')),
    path('api/', include('emotional_states.urls')),
    path('api/', include('emotional_development_records.urls')),
    path('api/', include('motor_development_types.urls')),
    path('api/', include('fine_gross_motor_types.urls')),
    path('api/', include('motor_development_records.urls')),
    path('api/', include('vaccines.urls')),
    path('api/', include('vaccination_records.urls')),
    path('api/', include('daily_event_types.urls')),
    path('api/', include('daily_event_records.urls')),
    path('api/', include('report_types.urls')),
    path('api/', include('progress_reports.urls')),
    path('api/', include('babysitters.urls')),
    path('api/', include('roles.urls')),
    path('api/', include('parent_roles.urls')),
    path('api/', include('notifications.urls')),
    path('api/', include('suggestion_warning_states.urls')),
    path('api/', include('suggestions_warnings.urls')),
    path('api/', include('babysitter_roles.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/', include('ml_engine.urls')),
]
