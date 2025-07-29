import pandas as pd
import re
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

def clean_text(text):
    text = str(text).lower().strip()
    text = re.sub(r"[^\w\s]", "", text)
    return text

# Load and verify data
data = pd.read_excel("../../datasets/profane_words.xlsx", sheet_name="Top 100 Profane Words used")
print("Class distribution:")
print(data["Label"].value_counts())

if not all(col in data.columns for col in ["Text", "Label"]):
    raise ValueError("Excel must contain 'Text' and 'Label' columns.")

data["clean_text"] = data["Text"].apply(clean_text)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    data["clean_text"], 
    data["Label"], 
    test_size=0.2, 
    random_state=42,
    stratify=data["Label"]
)

# Feature extraction
vectorizer = TfidfVectorizer(
    max_features=5000, 
    ngram_range=(1, 2),
    stop_words='english'  # Add stopwords removal
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train model with class weights
model = LogisticRegression(
    class_weight='balanced',  # Handle imbalanced classes
    max_iter=1000
)
model.fit(X_train_vec, y_train)

# Evaluate
print("\nTest set performance:")
y_pred = model.predict(X_test_vec)
print(classification_report(y_test, y_pred))

# Save artifacts
joblib.dump(model, "../models/profane_model_v2.pkl")
joblib.dump(vectorizer, "../models/vectorizer_v2.pkl")
print("\n✅ Model and vectorizer saved successfully!")