import pandas as pd
import random
from datetime import datetime, timedelta
from faker import Faker

# Initialize faker for realistic data generation
fake = Faker()

def generate_synthetic_data(existing_files, existing_folders, num_files=200, num_folders=20):
    # Analyze existing data patterns
    existing_file_types = existing_files['Type'].value_counts().to_dict()
    existing_folder_names = existing_folders['Name'].tolist()
    
    # Common patterns from your existing data
    name_prefixes = ['Lecture', 'Slide', 'Assignment', 'Exam', 'Note', 'Research', 
                    'Project', 'Exercise', 'Tutorial', 'Lab']
    academic_terms = ['CS101', 'MATH202', 'PHYS301', 'COMPSCI401', 'ALGORITHMS', 
                     'DATABASE', 'CALCULUS', 'STATISTICS', 'AI', 'ML']
    people_names = ['Dr Partey', 'Prof Smith', 'Dr Johnson', 'Prof Lee', 'Dr Brown']
    
    # Generate new folders
    new_folders = []
    for _ in range(num_folders):
        folder_type = random.choice([
            f"{random.choice(people_names)} {random.choice(['Lectures', 'Notes', 'Materials'])}",
            f"{random.choice(academic_terms)} {random.choice(['Assignments', 'Slides', 'Exams'])}",
            f"{random.choice(['Advanced', 'Basic', 'Fundamentals'])} {random.choice(['Python', 'C++', 'Algorithms'])}",
            *existing_folder_names  # Include variations of existing folder names
        ])
        
        new_folders.append({
            'Name': folder_type,
            'Type': 'FOLDER',
            'Items Count': random.randint(0, 20),
            'Created': fake.date_time_between(start_date='-1y', end_date='now').strftime('%m/%d/%Y, %I:%M:%S %p')
        })
    
    # Generate new files
    new_files = []
    for _ in range(num_files):
        # Determine file type based on existing distribution
        file_type = random.choices(
            list(existing_file_types.keys()),
            weights=list(existing_file_types.values()),
            k=1
        )[0]
        
        # Create realistic academic file names
        if random.random() < 0.7:  # 70% chance of academic-style name
            name_parts = [
                random.choice(name_prefixes),
                random.choice(['', str(random.randint(1, 10))]),
                random.choice(['', random.choice(academic_terms)]),
                random.choice(['', random.choice(['Final', 'Draft', 'Solution'])]),
                f".{file_type.lower()}"
            ]
            file_name = '_'.join(filter(None, name_parts)).replace(' ', '')
        else:  # 30% chance of more generic names
            file_name = f"{fake.word()}_{fake.word()}.{file_type.lower()}"
        
        # Get size similar to existing files
        size_kb = random.choice([
            round(random.uniform(0.1, 100)),  # Small files
            round(random.uniform(100, 1000)),  # Medium files
            round(random.uniform(1000, 5000))  # Large files
        ])
        
        new_files.append({
            'Name': file_name,
            'Type': file_type,
            'Size (KB)': size_kb,
            'Tags': random.choice(['', 'important', 'draft', 'final', 'review', 'confidential']),
            'Created': fake.date_time_between(start_date='-1y', end_date='now').strftime('%m/%d/%Y, %I:%M:%S %p')
        })
    
    return pd.DataFrame(new_files), pd.DataFrame(new_folders)

def main():
    # Load existing data
    existing_files = pd.read_excel('../datasets/file_metadata.xlsx', sheet_name='Files')
    existing_folders = pd.read_excel('../datasets/file_metadata.xlsx', sheet_name='Folders')
    
    # Generate synthetic data
    new_files, new_folders = generate_synthetic_data(existing_files, existing_folders)
    
    # Combine with existing data
    combined_files = pd.concat([existing_files, new_files], ignore_index=True)
    combined_folders = pd.concat([existing_folders, new_folders], ignore_index=True)
    
    # Save back to Excel
    with pd.ExcelWriter('../datasets/file_metadata.xlsx', engine='openpyxl') as writer:
        combined_files.to_excel(writer, sheet_name='Files', index=False)
        combined_folders.to_excel(writer, sheet_name='Folders', index=False)
    
    print(f"Added {len(new_files)} new files and {len(new_folders)} new folders to the dataset.")

if __name__ == "__main__":
    main()