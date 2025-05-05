from django.db import models

class UploadedFile(models.Model):
    user_id = models.IntegerField() 
    file = models.FileField(upload_to='uploads/')
    description = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file.name} uploaded by user {self.user_id}"
