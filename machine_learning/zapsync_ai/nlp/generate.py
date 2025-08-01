import pandas as pd
import random
from faker import Faker
import csv

fake = Faker()

# Configuration
NUM_SAMPLES = 5000  # Adjust as needed
PROFESSORS = ["Dr. Amoako", "Prof. Smith", "Dr. Johnson", "Prof. Lee", "Dr. Garcia"]
COURSES = ["CS101", "MATH202", "PHYS301", "CHEM102", "BIO205"]
CONTENT_TYPES = ["lecture notes", "slides", "assignments", "solutions", "readings", "exams"]
WEEKS = list(range(1, 13))  # Weeks 1-12
YEARS = ["2023", "2022", "2021"]
MONTHS = ["January", "February", "March", "April", "September", "October"]

def generate_query():
    """Generate realistic academic queries with variations"""
    pattern = random.choice([
        "{prof} {course} week {week} {content}",
        "{course} {content} week {week}",
        "{prof} {content} {year}",
        "{content} for {course}",
        "Week {week} {content} {prof}",
        "{month} {year} {content}",
        "{prof} {course} {content}"
    ])
    
    return pattern.format(
        prof=random.choice(PROFESSORS),
        course=random.choice(COURSES),
        week=random.choice(WEEKS),
        content=random.choice(CONTENT_TYPES),
        year=random.choice(YEARS),
        month=random.choice(MONTHS)
    )

def extract_entities(query):
    """Extract entities from generated query"""
    entities = []
    
    # Check for professor
    for prof in PROFESSORS:
        if prof in query:
            entities.append((prof, "professor"))
    
    # Check for course
    for course in COURSES:
        if course in query:
            entities.append((course, "course"))
    
    # Check for week number
    words = query.split()
    for word in words:
        if word.isdigit() and 1 <= int(word) <= 52:
            entities.append((word, "week"))
    
    # Check for content type
    for content in CONTENT_TYPES:
        if content in query:
            entities.append((content, "content_type"))
    
    return entities

def determine_intent(entities):
    """Determine intent based on entities"""
    entity_types = {e[1] for e in entities}
    
    if "week" in entity_types:
        return "find_lecture_materials"
    elif "course" in entity_types and "content_type" in entity_types:
        if "assignments" in {e[0] for e in entities}:
            return "find_assignments"
        elif "exams" in {e[0] for e in entities}:
            return "find_exam_materials"
    return "find_general_materials"

def generate_dataset(num_samples):
    data = []
    for _ in range(num_samples):
        query = generate_query()
        entities = extract_entities(query)
        intent = determine_intent(entities)
        
        data.append({
            "query": query,
            "intent": intent,
            "entities": entities
        })
    return pd.DataFrame(data)

if __name__ == "__main__":
    # Generate and save dataset
    df = generate_dataset(NUM_SAMPLES)
    df.to_csv("academic_queries.csv", index=False, quoting=csv.QUOTE_ALL)
    print(f"Generated {len(df)} samples in academic_queries.csv")