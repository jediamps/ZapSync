from django.urls import path
from .views import upload_file, get_files

urlpatterns = [
    path('upload/', upload_file, name='upload_file'),
    path('all/', get_files, name='get_files'),
]
