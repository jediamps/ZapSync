import os
import cloudinary.uploader
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import UploadedFile
from .serializers import UploadedFileSerializer
from .utils import decode_jwt, check_for_profanity
from rest_framework import status


@api_view(['POST'])
def upload_file(request):
    if not request.headers.get('Authorization'):
        return Response({'detail': 'Authorization token missing'}, status=status.HTTP_401_UNAUTHORIZED)

    token = request.headers.get('Authorization').split(' ')[1]
    user_id = decode_jwt(token)

    file = request.FILES.get('file')
    description = request.data.get('description', '')

    if not file:
        return Response({'detail': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

    # Profanity check (for any supported file type)
    if check_for_profanity(file, file.name):
        return Response(
            {'error': 'File contains profane or inappropriate language. Upload blocked.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(file)
        cloudinary_url = result.get('secure_url')
        public_id = result.get('public_id')

        # Save to DB
        uploaded_file = UploadedFile.objects.create(
            user_id=user_id,
            cloudinary_url=cloudinary_url,
            public_id=public_id,
            description=description
        )

        serializer = UploadedFileSerializer(uploaded_file)
        return Response({"message": "User upload successful", "data": serializer.data}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
