from rest_framework.decorators import api_view
from rest_framework.response import Response
from .predict import NLPPredictor

predictor = NLPPredictor()

@api_view(['POST'])
def process_query(request):
    text = request.data.get('text', '')
    if not text:
        return Response({"error": "No text provided"}, status=400)
    
    try:
        result = predictor.predict(text)
        return Response({
            "processed_query": text,
            "intent": result["intent"],
            "confidence": result["confidence"],
            "entities": result["entities"]
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)