from rest_framework import serializers
from .models import UploadedFile

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['id', 'user_id', 'cloudinary_url', 'public_id', 'description', 'uploaded_at']
