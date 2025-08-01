import joblib
import numpy as np

class NLPPredictor:
    def __init__(self):
        self.intent_model = joblib.load('trained_models/intent_model.pkl')
        self.entity_model = joblib.load('trained_models/entity_model.pkl')
        self.vectorizer = joblib.load('trained_models/tfidf_vectorizer.pkl')
    
    def predict(self, text):
        # Intent prediction
        X = self.vectorizer.transform([text])
        intent = self.intent_model.predict(X)[0]
        intent_proba = np.max(self.intent_model.predict_proba(X))
        
        # Entity prediction
        features = extract_features(text)  # Same as in train.py
        entities = self.entity_model.predict([features])[0]
        
        return {
            "intent": intent,
            "confidence": float(intent_proba),
            "entities": [{"value": ent[0], "type": ent[1]} for ent in entities]
        }