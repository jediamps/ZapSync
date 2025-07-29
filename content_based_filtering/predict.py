import joblib
import os
import sys
import re
import json
import warnings
from collections import Counter
from sklearn.exceptions import InconsistentVersionWarning

# Suppress version mismatch warnings
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

# Load model and vectorizer
models_dir = os.path.join(os.path.dirname(__file__), 'models')

model = joblib.load(os.path.join(models_dir, 'profane_model_v2.pkl'))
vectorizer = joblib.load(os.path.join(models_dir, 'vectorizer_v2.pkl'))

def clean_text(text):
    text = str(text).lower().strip()
    text = re.sub(r"[^\w\s]", "", text)
    return text

def analyze_content(content, threshold=0.5):
    if not content.strip():
        return {"error": "Empty content"}

    words = re.findall(r'\b\w{3,}\b', content.lower())
    if not words:
        return {"error": "No valid words found"}

    cleaned_words = [clean_text(w) for w in set(words)]
    X = vectorizer.transform(cleaned_words)  # Batch transform
    probas = model.predict_proba(X)[:, 1]

    results = [
        {"word": word, "count": words.count(word), "confidence": float(proba)}
        for word, proba in zip(cleaned_words, probas)
    ]
    # Rest of the logic...
    
    # Analyze each unique word
    results = []
    for word in set(words):
        cleaned = clean_text(word)
        X = vectorizer.transform([cleaned])
        proba = model.predict_proba(X)[0][1]
        results.append({
            "word": word,
            "count": word_counts[word],
            "confidence": float(proba)
        })
    
    # Calculate overall metrics
    total_profane = sum(1 for r in results if r["confidence"] > 0.5)
    max_confidence = max(r["confidence"] for r in results) if results else 0
    
    return {
        "words_analyzed": len(results),
        "total_profane_words": total_profane,
        "most_offensive_word": max(results, key=lambda x: x["confidence"]) if results else None,
        "should_reject": max_confidence > 0.5,  # Reject if any word >50% confidence
        "confidence": max_confidence
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No content provided"}))
        sys.exit(1)
        
    content = sys.argv[1]
    result = analyze_content(content)
    print(json.dumps(result))