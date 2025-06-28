from django.urls import path
from .views import create_folder, upload_to_folder, get_folders

urlpatterns = [
    path('create/', create_folder, name='create_folder'),
    path('<int:folder_id>/upload/', upload_to_folder, name='upload_to_folder'),
    path('all/', get_folders, name='get_folders'),
]