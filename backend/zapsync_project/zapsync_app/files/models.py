# models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UploadedFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')
    file = models.FileField(upload_to='uploads/')
    filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()  # Size of the file in bytes
    file_type = models.CharField(max_length=50)  # MIME type of the file
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(null=True, blank=True)  # Optional description

    def __str__(self):
        return self.filename

    def save(self, *args, **kwargs):
        # Set file size and MIME type when saving
        self.file_size = self.file.size
        self.file_type = self.file.content_type
        super().save(*args, **kwargs)
