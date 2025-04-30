from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User
from .serializers import RegisterUserSerializer

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
