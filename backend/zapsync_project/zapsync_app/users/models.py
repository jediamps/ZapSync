from django.db import models

class User(models.Model):
    # 🧑‍💻 Basic User Info
    fullname = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, null=True, blank=True)
    google_id = models.CharField(max_length=255, null=True, blank=True)  # Google OAuth users

    # 🌍 Location Info
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)

    # 📱 Device & Browser Info
    device_type = models.CharField(max_length=100, null=True, blank=True)  # Mobile/Desktop
    browser = models.CharField(max_length=100, null=True, blank=True)
    screen_width = models.IntegerField(null=True, blank=True)
    screen_height = models.IntegerField(null=True, blank=True)
    userAgent = models.CharField(max_length=255, null=True, blank=True)  # User-Agent string
    platform = models.CharField(max_length=100, null=True, blank=True)  # OS (Windows/Mac/Android)

    # 🔒 Security (reCAPTCHA)
    captcha_token = models.TextField(null=True, blank=True)

    # 📅 Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email  # Represent users by email in Django Admin
