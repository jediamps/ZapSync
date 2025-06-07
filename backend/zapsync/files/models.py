from django.db import models

class UploadedFile(models.Model):
    user_id = models.IntegerField()
    cloudinary_url = models.URLField(blank=True, null=True)  # Stores the Cloudinary file URL
    public_id = models.CharField(max_length=255, blank=True, null=True)  # Stores Cloudinary's file public ID
    description = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.public_id} uploaded by user {self.user_id}"
