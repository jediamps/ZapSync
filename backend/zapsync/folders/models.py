from django.db import models
from django.contrib.auth import get_user_model
from .utils import validate_folder_name

User = get_user_model()

class UploadedFile(models.Model):
    name = models.CharField(max_length=255)
    cloudinary_url = models.URLField()
    public_id = models.CharField(max_length=255)
    size = models.BigIntegerField(default=0)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Folder(models.Model):
    name = models.CharField(max_length=255, validators=[validate_folder_name])
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='folders')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['name', 'parent', 'owner']
        
    def __str__(self):
        return self.name

class FolderFile(models.Model):
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='folder_files')
    file = models.ForeignKey(UploadedFile, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['folder', 'file']