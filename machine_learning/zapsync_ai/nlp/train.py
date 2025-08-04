import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression  # Changed from LinearSVC
from sklearn.metrics import classification_report
from sklearn.pipeline import Pipeline
import joblib
import os
from sklearn.calibration import CalibratedClassifierCV  # For better probability estimates

# Constants
DATASET_PATH = "../datasets/file_metadata.csv"
MODEL_SAVE_PATH = "../models/file_classifier_model.pkl"

def load_and_preprocess_data():
    """Load and preprocess the dataset"""
    df = pd.read_csv(DATASET_PATH)
    
    # Convert tags from string representation to list
    df['tags'] = df['tags'].apply(lambda x: eval(x) if isinstance(x, str) else x)
    
    # Create combined text features for NLP
    df['combined_text'] = (
        df['name'] + ' ' + 
        df['description'] + ' ' + 
        df['course'] + ' ' + 
        df['lecturer'] + ' ' + 
        df['semester'] + ' ' + 
        df['content_type'] + ' ' + 
        df['week'].fillna('') + ' ' + 
        df['tags'].apply(lambda x: ' '.join(x))
    )
    
    # Our target will be predicting the content_type (lecture notes, slides, etc.)
    X = df['combined_text']
    y = df['content_type']
    
    return X, y

def train_model(X, y):
    """Train the NLP classification model"""
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Create pipeline with TF-IDF and classifier
    base_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            max_features=10000,
            ngram_range=(1, 2),
            stop_words='english'
        )),
        ('clf', LogisticRegression(  # Using LogisticRegression instead of LinearSVC
            class_weight='balanced',
            max_iter=1000,
            C=0.5,
            solver='lbfgs',  # Good for multiclass problems
            multi_class='multinomial'
        ))
    ])
    
    # Wrap with CalibratedClassifierCV for better probability estimates
    pipeline = CalibratedClassifierCV(base_pipeline, cv=3)
    
    # Train model
    print("⏳ Training model...")
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    print(classification_report(y_test, y_pred))
    
    # Show some example probabilities
    test_probs = pipeline.predict_proba(X_test[:3])
    print("\nExample probability distributions:")
    for i, probs in enumerate(test_probs):
        print(f"Sample {i+1}:")
        for cls, prob in zip(pipeline.classes_, probs):
            print(f"  {cls}: {prob:.3f}")
    
    return pipeline

def save_model(pipeline):
    """Save the model"""
    # Ensure parent directory exists
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    
    # Save the entire pipeline
    joblib.dump(pipeline, MODEL_SAVE_PATH)
    print(f"✅ Model saved to {MODEL_SAVE_PATH}")

def main():
    try:
        # Load and preprocess data
        X, y = load_and_preprocess_data()
        
        # Train model
        model = train_model(X, y)
        
        # Save model
        save_model(model)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()