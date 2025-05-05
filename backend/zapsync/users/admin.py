from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    ordering = ['-created_at']
    list_display = ['email', 'fullname', 'is_staff']
    fieldsets = (
        (None, {'fields': ('email', 'fullname', 'password')}),
        ('Personal Info', {'fields': ('phone', 'google_id')}),
        ('Location Info', {'fields': ('ip_address', 'latitude', 'longitude', 'city', 'country')}),
        ('Device Info', {'fields': ('device_type', 'browser', 'screen_width', 'screen_height', 'userAgent', 'platform')}),
        ('Security', {'fields': ('captcha_token',)}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'fullname', 'password1', 'password2'),
        }),
    )

admin.site.register(User, UserAdmin)
