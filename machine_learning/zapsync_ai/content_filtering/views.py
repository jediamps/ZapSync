# detector/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .utils import ProfanityDetector

detector = ProfanityDetector()

@api_view(['POST'])
def predict(request):
    text = request.data.get('text', '')
    analysis_type = request.data.get('type', 'word')  # 'word' or 'full'
    
    if not text:
        return Response(
            {'error': 'Text parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        if analysis_type == 'full':
            result = detector.analyze_content(text)
        else:
            result = detector.predict(text)
        
        return Response(result)
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )