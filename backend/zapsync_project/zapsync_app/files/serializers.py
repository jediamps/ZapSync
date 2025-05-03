# serializers.py
from rest_framework import serializers
from .models import UploadedFile

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['id', 'user', 'file', 'filename', 'file_size', 'file_type', 'uploaded_at', 'description']
        read_only_fields = ['id', 'user', 'uploaded_at']
