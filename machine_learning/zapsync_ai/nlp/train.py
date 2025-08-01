import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn_crfsuite import CRF
import joblib

def load_data():
    """Load data from CSV and prepare for training"""
    df = pd.read_csv("../datasets/academic_queries.csv")
    
    # Convert string representation of entities to actual lists
    df['entities'] = df['entities'].apply(eval)  # Only if saved as string literals
    
    return df

def train_models():
    data = load_data()
    
    # 1. Intent Classifier
    vectorizer = TfidfVectorizer(max_features=5000)
    X = vectorizer.fit_transform(data['query'])
    y_intent = data['intent']
    
    intent_model = LogisticRegression(multi_class='ovr', max_iter=1000)
    intent_model.fit(X, y_intent)
    
    # 2. Entity Recognizer (CRF)
    X_entities = [extract_features(q) for q in data['query']]
    y_entities = data['entities']
    
    entity_model = CRF(
        algorithm='lbfgs',
        c1=0.1,
        c2=0.1,
        max_iterations=100,
        all_possible_transitions=True
    )
    entity_model.fit(X_entities, y_entities)
    
    # Save models
    joblib.dump(intent_model, 'trained_models/intent_model.pkl')
    joblib.dump(entity_model, 'trained_models/entity_model.pkl')
    joblib.dump(vectorizer, 'trained_models/tfidf_vectorizer.pkl')
    print("Models trained and saved successfully!")

def extract_features(text):
    """Enhanced feature extraction for CRF"""
    features = []
    words = text.split()
    
    for i, word in enumerate(words):
        features.append({
            'word': word,
            'word.lower()': word.lower(),
            'word.istitle()': word.istitle(),
            'word.isupper()': word.isupper(),
            'word.isdigit()': word.isdigit(),
            'prefix1': word[:1],
            'prefix2': word[:2],
            'prefix3': word[:3],
            'suffix1': word[-1:],
            'suffix2': word[-2:],
            'suffix3': word[-3:],
            'length': len(word),
            'position': i,
            'is_prof_title': word.lower() in ['dr.', 'prof.'],
            'is_course_code': any(c in word for c in ['CS','MATH','PHYS']),
            'is_week': word.isdigit() and 1 <= int(word) <= 52,
        })
    
    return features

if __name__ == "__main__":
    train_models()