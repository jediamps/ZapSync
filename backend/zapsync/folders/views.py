from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Folder, UploadedFile, FolderFile
from .serializers import FolderSerializer, CreateFolderSerializer, UploadToFolderSerializer
import cloudinary.uploader
from .utils import decode_jwt, check_for_profanity
from django.db.models import Count

@api_view(['POST'])
def create_folder(request):
    serializer = CreateFolderSerializer(data=request.data)
    if serializer.is_valid():
        folder = serializer.save(owner=request.user)
        return Response(FolderSerializer(folder).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def upload_to_folder(request, folder_id):
    # Authentication check
    if not request.headers.get('Authorization'):
        return Response({'detail': 'Authorization token missing'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user_id = decode_jwt(token)
        
        # Get files using the correct key from your logs
        files = request.FILES.getlist('files[]')
        
        if not files:
            return Response({'detail': 'No files uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify folder exists and belongs to user
        folder = Folder.objects.get(pk=folder_id, owner_id=user_id)
        
        uploaded_files = []
        skipped_files = []
        
        for file in files:
            try:
                # Skip profanity check for files larger than 10MB
                skip_profanity_check = file.size > 10_000_000  # 10MB threshold
                
                if not skip_profanity_check and check_for_profanity(file, file.name):
                    skipped_files.append({'name': file.name, 'reason': 'Profanity check failed'})
                    continue

                # Upload to Cloudinary
                result = cloudinary.uploader.upload(
                    file,
                    resource_type="auto",
                    timeout=30  # Increased timeout for large files
                )
                
                # Create database records
                uploaded_file = UploadedFile.objects.create(
                    name=file.name,
                    cloudinary_url=result['secure_url'],
                    public_id=result['public_id'],
                    size=result['bytes'],
                    owner_id=user_id
                )
                FolderFile.objects.create(folder=folder, file=uploaded_file)
                
                uploaded_files.append({
                    'name': uploaded_file.name,
                    'url': uploaded_file.cloudinary_url,
                    'size': uploaded_file.size,
                    'skipped_profanity_check': skip_profanity_check
                })
                
            except Exception as file_error:
                skipped_files.append({'name': file.name, 'reason': str(file_error)})
                continue

        response_data = {
            'message': f'Successfully processed {len(uploaded_files)} file(s)',
            'uploaded_files': uploaded_files,
        }
        
        if skipped_files:
            response_data['skipped_files'] = skipped_files
        
        return Response(response_data, status=status.HTTP_201_CREATED)

    except Folder.DoesNotExist:
        return Response({'detail': 'Folder not found or not owned by user'}, 
                      status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_folders(request):
    """Get all folders for the authenticated user with file counts"""
    if not request.headers.get('Authorization'):
        return Response({'detail': 'Authorization token missing'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user_id = decode_jwt(token)
        
        # Get folders with annotated file count
        folders = Folder.objects.filter(owner_id=user_id).annotate(
            file_count=Count('folder_files')
        ).order_by('-created_at')
        
        serializer = FolderSerializer(folders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)