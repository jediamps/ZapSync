import csv
import os
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

# Configuration
NUM_FILES = 500
CSV_FILE = "../datasets/file_metadata.csv"  # Saved one folder up in dataset directory

# Constants based on your models
LECTURERS = ["Dr. Gadaafi", "Dr. Amoako", "Prof. Mensah", "Mrs. Nyarko"]
COURSES = ["IT Fundamentals", "Calculus I", "African History", "Programming Basics", 
           "Data Structures", "Database Systems", "Operating Systems", "Computer Networks"]
FILE_TYPES = ["lecture notes", "slides", "assignments", "readings", "tutorial", "exam", "solution"]
WEEKS = [f"Week {i}" for i in range(1, 13)]
SEMESTERS = ["Fall 2023", "Spring 2024", "Summer 2024"]
EXTENSIONS = {
    "lecture notes": ".pdf",
    "slides": ".pptx",
    "assignments": ".docx",
    "readings": ".pdf",
    "tutorial": ".pdf",
    "exam": ".pdf",
    "solution": ".pdf"
}

def generate_file_metadata():
    """Generate a single file metadata entry matching your File and Folder schema"""
    lecturer = random.choice(LECTURERS)
    course = random.choice(COURSES)
    file_type = random.choice(FILE_TYPES)
    week = random.choice(WEEKS) if file_type in ["lecture notes", "slides", "tutorial"] else None
    semester = random.choice(SEMESTERS)
    
    # Generate filename based on content
    if week:
        filename = f"{course.replace(' ', '_')}_{week.replace(' ', '')}_{file_type.replace(' ', '_')}"
    else:
        filename = f"{course.replace(' ', '_')}_{file_type.replace(' ', '_')}"
    
    # Add extension
    filename += EXTENSIONS.get(file_type, ".pdf")
    
    # Generate description
    if week:
        description = f"{file_type.capitalize()} for {course} ({semester}) - {week} by {lecturer}"
    else:
        description = f"{file_type.capitalize()} for {course} ({semester}) by {lecturer}"
    
    # Generate random size between 100KB and 50MB
    size_kb = random.randint(100, 51200)
    
    # Generate random tags (2-4 tags per file)
    tags = set()
    tags.add(course.lower())
    tags.add(lecturer.split()[-1].lower())  # Last name
    tags.add(file_type.replace(' ', '-'))
    if week:
        tags.add(week.lower().replace(' ', '-'))
    tags.add(semester.lower().replace(' ', '-'))
    
    # Random creation date within the last 2 years
    created_at = fake.date_time_between(start_date='-2y', end_date='now')
    
    return {
        "name": filename,
        "description": description,
        "file_type": EXTENSIONS.get(file_type, ".pdf")[1:],  # Remove dot
        "size": size_kb * 1024,  # Convert to bytes
        "tags": list(tags),
        "created_at": created_at.isoformat(),
        "course": course,
        "lecturer": lecturer,
        "semester": semester,
        "content_type": file_type,
        "week": week if week else ""
    }

def create_dataset():
    """Create the dataset CSV file if it doesn't exist"""
    if os.path.exists(CSV_FILE):
        print(f"✅ Dataset already exists at {CSV_FILE}")
        return

    # Ensure dataset directory exists
    os.makedirs(os.path.dirname(CSV_FILE), exist_ok=True)

    with open(CSV_FILE, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = [
            'name', 'description', 'file_type', 'size', 'tags', 
            'created_at', 'course', 'lecturer', 'semester', 
            'content_type', 'week'
        ]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for _ in range(NUM_FILES):
            writer.writerow(generate_file_metadata())
    
    print(f"✅ Generated {NUM_FILES} file entries in {CSV_FILE}")

if __name__ == "__main__":
    create_dataset()