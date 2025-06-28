from django.db import models

class UploadedFile(models.Model):
    user_id = models.IntegerField()
    name = models.CharField(max_length=255)  # Original filename
    cloudinary_url = models.URLField()
    public_id = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    size = models.BigIntegerField(default=0)  # File size in bytes
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (user {self.user_id})"