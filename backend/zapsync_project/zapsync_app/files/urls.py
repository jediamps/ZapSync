from django.urls import path
from .views import upload_file, list_user_files

urlpatterns = [
    path('upload/', upload_file, name='file-upload'),
    path('files/my/', list_user_files),
]
