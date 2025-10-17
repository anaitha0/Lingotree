import csv
import random
from django.db import transaction
from learning.models import Challenge

# Mapping for difficulty levels
DIFFICULTY_MAPPING = {
    'Easy': 'Beginner',
    'Medium': 'Intermediate',
    'Hard': 'Advanced'
}

# Timer settings (in seconds)
TIMER_SETTINGS = {
    'Easy': 90,      # 90 seconds
    'Medium': 120,   # 2 minutes
    'Hard': 300      # 5 minutes
}

# Points settings
POINTS_SETTINGS = {
    'Easy': 20,
    'Medium': 40,
    'Hard': 60
}

def import_challenges_from_csv(file_path):
    with transaction.atomic():
        with open(file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            
            for row in csv_reader:
                # Randomly decide translation direction
                is_english_to_arabic = random.choice([True, False])
                
                if is_english_to_arabic:
                    source_language = 'English'
                    target_language = 'Arabic'
                    paragraph = row['English']
                    correct_translation = row['Arabic']
                else:
                    source_language = 'Arabic'
                    target_language = 'English'
                    paragraph = row['Arabic']
                    correct_translation = row['English']
                
                # Get difficulty level from CSV
                difficulty = row['Eng_Difficulty_Label']
                
                # Create the challenge
                Challenge.objects.create(
                    paragraph=paragraph,
                    source_language=source_language,
                    target_language=target_language,
                    difficulty_level=DIFFICULTY_MAPPING[difficulty],
                    correct_translation=correct_translation,
                    timer_seconds=TIMER_SETTINGS[difficulty],
                    topic=row['Topic_Label'],
                    points=POINTS_SETTINGS[difficulty]
                )
                
                print(f"Created challenge: {source_language} -> {target_language}, "
                      f"Difficulty: {DIFFICULTY_MAPPING[difficulty]}, "
                      f"Topic: {row['Topic_Label']}, "
                      f"Timer: {TIMER_SETTINGS[difficulty]} seconds")

if __name__ == "__main__":
    csv_file_path = 'NLP_DATASET_CHALLENGES - Sheet1.csv'  # Replace with actual path
    import_challenges_from_csv(csv_file_path)