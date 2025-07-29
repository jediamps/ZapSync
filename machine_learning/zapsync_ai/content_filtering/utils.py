import os
import joblib
import re
from django.conf import settings
from sklearn.exceptions import NotFittedError

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))

class ProfanityDetector:
    def __init__(self):
        try:
            self.model = joblib.load(os.path.join(MODEL_DIR, 'profane_model_v2.pkl'))
            self.vectorizer = joblib.load(os.path.join(MODEL_DIR, 'vectorizer_v2.pkl'))
            self._verify_models()
        except Exception as e:
            raise RuntimeError(f"Failed to load models: {str(e)}")

    def _verify_models(self):
        """Verify models are properly loaded"""
        if not hasattr(self.vectorizer, 'vocabulary_'):
            raise NotFittedError("Vectorizer missing vocabulary")
        if not hasattr(self.model, 'classes_'):
            raise NotFittedError("Model not properly trained")

    @staticmethod
    def clean_text(text):
        text = str(text).lower().strip()
        text = re.sub(r"[^\w\s]", "", text)
        return text

    def analyze_content(self, content, threshold=0.5):
        if not content.strip():
            return {"error": "Empty content"}

        words = re.findall(r'\b\w{3,}\b', content.lower())
        if not words:
            return {"error": "No valid words found"}

        word_counts = Counter(words)
        cleaned_words = [self.clean_text(w) for w in set(words)]
        
        # Batch transform for better performance
        X = self.vectorizer.transform(cleaned_words)
        probas = self.model.predict_proba(X)[:, 1]

        results = [
            {
                "word": word,
                "count": word_counts[word],
                "confidence": float(proba),
                "is_profane": proba > threshold
            }
            for word, proba in zip(cleaned_words, probas)
        ]

        # Calculate overall metrics
        total_profane = sum(1 for r in results if r["confidence"] > threshold)
        max_confidence = max(r["confidence"] for r in results) if results else 0
        most_offensive = max(results, key=lambda x: x["confidence"]) if results else None

        return {
            "words_analyzed": len(results),
            "total_profane_words": total_profane,
            "most_offensive_word": most_offensive,
            "should_reject": max_confidence > threshold,
            "confidence": max_confidence,
            "detailed_results": results
        }

    def predict(self, text):
        """Simplified version for single word checks"""
        try:
            cleaned = self.clean_text(text)
            X = self.vectorizer.transform([cleaned])
            proba = self.model.predict_proba(X)[0][1]
            return {
                'is_profane': bool(self.model.predict(X)[0]),
                'confidence': float(proba),
                'should_reject': proba > 0.5
            }
        except Exception as e:
            raise RuntimeError(f"Prediction failed: {str(e)}")