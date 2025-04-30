from django.contrib import admin
from .users.models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('fullname', 'email', 'phone', 'city', 'country', 'created_at')
    search_fields = ('email', 'fullname', 'phone', 'city', 'country')

