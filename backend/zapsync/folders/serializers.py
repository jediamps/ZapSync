from rest_framework import serializers
from .models import Folder, UploadedFile, FolderFile
from django.contrib.auth import get_user_model

User = get_user_model()

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['id', 'name', 'cloudinary_url', 'size', 'created_at']

class FolderFileSerializer(serializers.ModelSerializer):
    file = UploadedFileSerializer()
    
    class Meta:
        model = FolderFile
        fields = ['id', 'file', 'uploaded_at']

class FolderSerializer(serializers.ModelSerializer):
    file_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Folder
        fields = ['id', 'name', 'description', 'parent', 'created_at', 'updated_at', 'file_count']
        read_only_fields = ['id', 'created_at', 'updated_at', 'file_count']

class CreateFolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['name', 'description', 'parent']

class UploadToFolderSerializer(serializers.Serializer):
    files = serializers.ListField(
        child=serializers.FileField()
    )