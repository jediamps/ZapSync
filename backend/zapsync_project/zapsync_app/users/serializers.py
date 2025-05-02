from rest_framework import serializers
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from .models import User  


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password_hash': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password_hash'] = make_password(validated_data['password_hash'])
        return super().create(validated_data)

class LoginUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    latitude = serializers.FloatField(required=False, allow_null=True)
    longitude = serializers.FloatField(required=False, allow_null=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # Using the custom User model directly here instead of get_user_model()
        user = User.objects.filter(email=email).first()
        if user and check_password(password, user.password_hash):  # Make sure password field is correct
            data['user'] = user  # Attach user instance to data
            return data
        raise serializers.ValidationError("Invalid email or password")
