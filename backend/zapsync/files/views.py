from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UploadedFile
from .serializers import UploadedFileSerializer
from .utils import decode_jwt, check_for_profanity
import cloudinary


@api_view(['GET'])
def get_files(request):
    """Get all files for the authenticated user"""
    if not request.headers.get('Authorization'):
        return Response({'detail': 'Authorization token missing'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user_id = decode_jwt(token)
        
        # Get files ordered by most recent first
        files = UploadedFile.objects.filter(user_id=user_id).order_by('-uploaded_at')
        serializer = UploadedFileSerializer(files, many=True)
        
        return Response({
            'count': len(serializer.data),
            'files': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def upload_file(request):
    """Upload a single file"""
    if not request.headers.get('Authorization'):
        return Response({'detail': 'Authorization token missing'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user_id = decode_jwt(token)

        file = request.FILES.get('file')
        description = request.data.get('description', '')

        if not file:
            return Response({'detail': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        # Profanity check
        if check_for_profanity(file, file.name):
            return Response(
                {'error': 'File contains inappropriate content. Upload blocked.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Upload to Cloudinary
        result = cloudinary.uploader.upload(file)
        
        # Save to DB
        uploaded_file = UploadedFile.objects.create(
            user_id=user_id,
            cloudinary_url=result['secure_url'],
            public_id=result['public_id'],
            description=description,
            name=file.name,  # Add original filename
            size=file.size   # Add file size
        )

        serializer = UploadedFileSerializer(uploaded_file)
        return Response({
            "message": "File uploaded successfully",
            "file": serializer.data
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)