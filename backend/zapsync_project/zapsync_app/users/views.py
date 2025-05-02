from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User
from .serializers import RegisterUserSerializer, LoginUserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from geopy.geocoders import Nominatim

@api_view(['POST'])
def register_user(request):
    # Create the serializer and pass the data from the request
    serializer = RegisterUserSerializer(data=request.data)

    if serializer.is_valid():
        # Save the validated user data to the database using the ORM
        user = serializer.save()

        return Response({"message": "User registered successfully!", "user": serializer.data}, status=201)
    
    # If the data is invalid, return the errors
    return Response(serializer.errors, status=400)



@api_view(['POST'])
def login_user(request):
    # Use the LoginUserSerializer
    serializer = LoginUserSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data['user']
        latitude = serializer.validated_data.get('latitude')
        longitude = serializer.validated_data.get('longitude')

        # Update location details if latitude and longitude are provided
        if latitude and longitude:
            try:
                geolocator = Nominatim(user_agent="zapsync-app")
                location = geolocator.reverse(f"{latitude}, {longitude}", language='en')
                address = location.raw.get('address', {})

                user.latitude = latitude
                user.longitude = longitude
                user.city = address.get('city') or address.get('town') or address.get('village')
                user.country = address.get('country')
            except Exception as e:
                print("Geolocation error:", e)

        # Update IP
        ip = request.META.get('REMOTE_ADDR')
        user.ip_address = ip
        user.save()

        # Generate JWT
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful!",
            "token": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            "user": {
                "email": user.email,
                "fullname": user.fullname,
                "city": user.city,
                "country": user.country,
            }
        })

    return Response(serializer.errors, status=400)