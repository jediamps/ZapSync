from rest_framework.decorators import api_view
from rest_framework.response import Response
import joblib
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import Dict, Union, List
import os

class NLPPredictor:
    def __init__(self):
        # Load models
        self.model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'file_classifier_model.pkl')
        self.semantic_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        try:
            self.classifier = joblib.load(self.model_path)
        except Exception as e:
            raise RuntimeError(f"Failed to load models: {str(e)}")

    def extract_entities(self, text: str) -> Dict[str, Union[str, List[str]]]:
        """Extract key entities from search query"""
        entities = {
            'courses': [],
            'lecturers': [],
            'file_types': [],
            'weeks': [],
            'semesters': [],
            'keywords': []
        }
        
        # Known entity lists (could be loaded from config)
        known_courses = ["IT Fundamentals", "Calculus I", "African History", "Programming Basics"]
        known_lecturers = ["Dr. Gadaafi", "Dr. Amoako", "Prof. Mensah", "Mrs. Nyarko"]
        known_file_types = ["lecture notes", "slides", "assignments", "readings"]
        
        # Simple pattern matching
        text_lower = text.lower()
        for course in known_courses:
            if course.lower() in text_lower:
                entities['courses'].append(course)
        
        for lecturer in known_lecturers:
            if lecturer.lower() in text_lower:
                entities['lecturers'].append(lecturer)
        
        for file_type in known_file_types:
            if file_type.lower() in text_lower:
                entities['file_types'].append(file_type)
        
        # Week detection
        if 'week' in text_lower:
            week_part = text_lower.split('week')[-1].strip()
            if week_part and week_part[0].isdigit():
                entities['weeks'].append(f"Week {week_part[0]}")
        
        # Semester detection
        if 'fall' in text_lower:
            entities['semesters'].append('Fall')
        if 'spring' in text_lower:
            entities['semesters'].append('Spring')
        if 'summer' in text_lower:
            entities['semesters'].append('Summer')
        
        return entities

    def predict_intent(self, text: str) -> Dict[str, Union[str, float]]:
        """Predict the search intent using the classifier"""
        try:
            # Transform text using the same preprocessing as during training
            text_processed = " ".join([
                text.lower(), 
                " ".join(self.extract_entities(text)["courses"]),
                " ".join(self.extract_entities(text)["file_types"])
            ])
            
            # Debug the input
            print(f"Processed text for prediction: {text_processed}")
            
            # Get prediction
            prediction = self.classifier.predict_proba([text_processed])[0]
            top_idx = np.argmax(prediction)
            intent = self.classifier.classes_[top_idx]
            confidence = float(prediction[top_idx])
            
            # Debug output
            print(f"Raw prediction: {prediction}")
            print(f"Predicted intent: {intent} (confidence: {confidence})")
            
            return {
                "intent": intent,
                "confidence": confidence
            }
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            return {
                "intent": "unknown",
                "confidence": 0.0,
                "error": str(e)
            }

    def predict(self, text: str) -> Dict:
        """Main prediction method"""
        entities = self.extract_entities(text)
        intent_result = self.predict_intent(text)
        
        return {
            "intent": intent_result["intent"],
            "confidence": intent_result["confidence"],
            "entities": entities
        }

# Initialize predictor instance
predictor = NLPPredictor()

@api_view(['POST'])
def process_request(request):
    """
    Process natural language search queries
    Example request body:
    {
        "text": "Find Dr. Amoako's week 3 lecture notes on IT Fundamentals"
    }
    """
    text = request.data.get('text', '').strip()
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
        return Response({
            "error": f"Processing failed: {str(e)}",
            "processed_query": text,
            "intent": "error",
            "confidence": 0.0,
            "entities": {}
        }, status=500)