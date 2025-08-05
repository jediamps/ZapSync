from rest_framework.decorators import api_view
from rest_framework.response import Response
import joblib
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import Dict, Union, List
import os
import re
from sklearn.feature_extraction.text import TfidfVectorizer

class NLPPredictor:
    def __init__(self):
        # Model paths
        self.model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'file_classifier_model.pkl')
        self.vectorizer_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'keyword_extractor.pkl')
        
        try:
            # Load classifier pipeline and vectorizer
            self.classifier_pipeline = joblib.load(self.model_path)
            self.keyword_extractor = joblib.load(self.vectorizer_path)
            self.semantic_model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            raise RuntimeError(f"Failed to load models: {str(e)}")

    def preprocess_text(self, text: str) -> str:
        """Match the preprocessing used during training"""
        if not isinstance(text, str):
            return ""
        text = re.sub(r"[^\w\s'-]", " ", text.lower())
        text = re.sub(r"\b\d+\b", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def extract_entities(self, text: str) -> Dict[str, Union[str, List[str]]]:
        """Enhanced entity extraction matching our new categories"""
        entities = {
            'courses': [],
            'lecturers': [],
            'file_types': [],
            'categories': [],
            'weeks': [],
            'semesters': [],
            'keywords': self.extract_keywords(text)  # Using our trained keyword extractor
        }
        
        # Updated known entities to match your dataset
        known_courses = ["Python", "Machine Learning", "Operations Research", "Software Engineering"]
        known_lecturers = ["Dr Partey", "Prof Eyram", "Dr Gadafi", "Prof Mensah"]
        
        text_lower = text.lower()
        
        # Extract courses
        for course in known_courses:
            if course.lower() in text_lower:
                entities['courses'].append(course)
        
        # Extract lecturers
        for lecturer in known_lecturers:
            if lecturer.lower() in text_lower:
                entities['lecturers'].append(lecturer)
        
        # Extract file types (extension-based)
        file_types = {
            'pdf': 'PDF',
            'docx': 'Word',
            'pptx': 'PowerPoint',
            'png': 'Image',
            'jpg': 'Image',
            'jpeg': 'Image',
            'cpp': 'Code',
            'py': 'Code'
        }
        for ext, display_name in file_types.items():
            if f'.{ext}' in text_lower:
                entities['file_types'].append(display_name)
        
        # Week detection
        week_match = re.search(r'week\s*(\d+)', text_lower)
        if week_match:
            entities['weeks'].append(f"Week {week_match.group(1)}")
        
        return entities

    def extract_keywords(self, text: str, top_n: int = 5) -> List[str]:
        """Extract keywords using our trained vectorizer"""
        processed_text = self.preprocess_text(text)
        tfidf_matrix = self.keyword_extractor.transform([processed_text])
        feature_array = np.array(self.keyword_extractor.get_feature_names_out())
        tfidf_sorting = np.argsort(tfidf_matrix.toarray()).flatten()[::-1]
        return feature_array[tfidf_sorting][:top_n].tolist()

    def predict_intent(self, text: str) -> Dict[str, Union[str, float]]:
        """Predict the file category using our classifier"""
        try:
            processed_text = self.preprocess_text(text)
            
            # Get prediction with confidence
            prediction = self.classifier_pipeline.predict_proba([processed_text])[0]
            top_idx = np.argmax(prediction)
            intent = self.classifier_pipeline.classes_[top_idx]
            confidence = float(prediction[top_idx])
            
            # Apply business rules
            intent = self.apply_business_rules(processed_text, intent, confidence)
            
            return {
                "intent": intent,
                "confidence": confidence
            }
        except Exception as e:
            return {
                "intent": "unknown",
                "confidence": 0.0,
                "error": str(e)
            }

    def apply_business_rules(self, text: str, intent: str, confidence: float) -> str:
        """Override predictions based on business rules"""
        # Force certain patterns regardless of model prediction
        if 'lecture' in text and intent != 'lecture':
            return 'lecture'
        if 'slide' in text and intent != 'slide':
            return 'slide'
        if 'assignment' in text and intent != 'assignment':
            return 'assignment'
        if 'exam' in text and intent != 'exam':
            return 'exam'
        if 'research' in text and intent != 'research':
            return 'research'
        return intent

    def predict(self, text: str) -> Dict:
        """Main prediction method with enhanced output"""
        entities = self.extract_entities(text)
        intent_result = self.predict_intent(text)
        
        return {
            "text": text,
            "predicted_category": intent_result["intent"],
            "confidence": intent_result["confidence"],
            "entities": entities,
            "suggested_filters": self.generate_filters(intent_result, entities)
        }

    def generate_filters(self, intent_result: Dict, entities: Dict) -> Dict:
        """Generate search filters for Node.js API"""
        filters = {
            'category': intent_result['intent'],
            'file_type': entities['file_types'],
            'course': entities['courses'],
            'lecturer': entities['lecturers'],
            'week': entities['weeks'],
            'keywords': entities['keywords']
        }
        return {k: v for k, v in filters.items() if v}  # Remove empty filters

# Initialize predictor instance
predictor = NLPPredictor()

@api_view(['POST'])
def process_request(request):
    """
    Classify files based on their names and metadata
    Example Postman request:
    POST /api/classify-file
    {
        "text": "Dr Partey Lecture notes week 5 machine learning.pdf"
    }
    """
    try:
        text = request.data.get('text', '').strip()
        if not text:
            return Response({"error": "No text provided"}, status=400)
        
        result = predictor.predict(text)
        
        return Response({
            "success": True,
            "result": result
        })
    
    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=500)