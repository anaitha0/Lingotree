"""
URL configuration for translation_tool project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path
from learning.views import RegisterUserView, LoginUserView, UserProfileView, LessonListView, LessonDetailView
from learning.views import ChallengeListCreateView, ChallengeDetailView
from learning.views import MissionListView, MissionDetailView
from learning.views import ExerciseListView, AddPointsView, PlacementTestView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('lessons/', LessonListView.as_view(), name='lesson-list'),  
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'), 
    path('challenges/', ChallengeListCreateView.as_view(), name='challenge-list-create'),
    path('challenges/<int:pk>/', ChallengeDetailView.as_view(), name='challenge-detail'),
    path('missions/', MissionListView.as_view(), name='mission_list'),
    path('missions/<int:mission_order>/', MissionDetailView.as_view(), name='mission_detail'),
    path('add-points/<str:username>/', AddPointsView.as_view(), name='add_points'),
    path('placement-test/start/', PlacementTestView.as_view(), name='placement_test_start'),
    path('exercises/', ExerciseListView.as_view(), name='exercise_list'),
]
