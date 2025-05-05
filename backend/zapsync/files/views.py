from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import UploadedFile
from .serializers import UploadedFileSerializer
from .utils import decode_jwt  # Import the JWT decoding function
from rest_framework import status

@api_view(['POST'])
def upload_file(request):
    if not request.headers.get('Authorization'):
        return Response({'detail': 'Authorization token missing'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Extract the token from the Authorization header
    token = request.headers.get('Authorization').split(' ')[1]
    
    # Decode the token and get the user ID
    user_id = decode_jwt(token)

    # Create the file record and associate it with the user_id
    file = request.FILES['file']
    description = request.data.get('description', '')

    uploaded_file = UploadedFile.objects.create(user_id=user_id, file=file, description=description)

    # Serialize the uploaded file and return response
    serializer = UploadedFileSerializer(uploaded_file)
    return Response({"message": "User upload successful"}, status=status.HTTP_201_CREATED)
