# views.py

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import UploadedFile
from .serializers import UploadedFileSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure that the user is authenticated
@parser_classes([MultiPartParser, FormParser])  # Allow file upload via form
def upload_file(request):
    file = request.FILES.get('file')  # Get the file from the request
    description = request.data.get('description', '')  # Optionally, get a description

    if not file:
        return Response({'error': 'No file provided.'}, status=400)  # Return an error if no file is provided

    # Create the file entry in the database and associate it with the user (request.user is the authenticated user)
    uploaded = UploadedFile.objects.create(
        user=request.user,  # Associate the file with the logged-in user
        file=file,
        filename=file.name,
        description=description
    )

    serializer = UploadedFileSerializer(uploaded)  # Serialize the uploaded file object
    return Response({'message': 'File uploaded successfully.', 'file': serializer.data}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure that the user is authenticated
def list_user_files(request):
    # Filter files based on the authenticated user (request.user)
    files = UploadedFile.objects.filter(user=request.user).order_by('-uploaded_at')
    serializer = UploadedFileSerializer(files, many=True)  # Serialize the file queryset
    return Response(serializer.data)
