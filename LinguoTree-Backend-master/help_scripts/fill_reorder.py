import csv
from django.db import transaction
from learning.models import ReorderTranslationExercise
import ast

# Mapping for difficulty levels
DIFFICULTY_MAPPING = {
    'Easy': 'Beginner',
    'Medium': 'Intermediate',
    'Hard': 'Advanced'
}

# Points settings
POINTS_SETTINGS = {
    'Easy': 20,
    'Medium': 40,
    'Hard': 60
}

# Mission ID ranges
MISSION_RANGES = {
    'Beginner': range(63, 73),    # 63-72
    'Intermediate': range(73, 83), # 73-82
    'Advanced': range(83, 93)      # 83-92
}

def get_mission_id_for_exercise(difficulty, exercise_count):
    """
    Returns appropriate mission ID based on difficulty and exercise count.
    Each mission should have 2 exercises.
    """
    mission_range = list(MISSION_RANGES[DIFFICULTY_MAPPING[difficulty]])
    mission_index = (exercise_count // 2) % len(mission_range)
    return mission_range[mission_index]

def import_exercises_from_csv(file_path):
    with transaction.atomic():
        exercise_counts = {'Easy': 0, 'Medium': 0, 'Hard': 0}
        
        with open(file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            
            for row in csv_reader:
                difficulty = row['Eng_Difficulty_Label']
                exercise_counts[difficulty] += 1
                
                # Convert string representation of list to actual list
                pieces = ast.literal_eval(row['pieces'])
                
                # Determine language direction based on the first piece
                # If first piece contains Arabic characters, it's Arabic to English
                is_arabic = any('\u0600' <= char <= '\u06FF' for char in pieces[0])
                
                if is_arabic:
                    source_language = 'Arabic'
                    target_language = 'English'
                    sentence = row['sentence']
                    correct_translation = row['correct_translation']
                else:
                    source_language = 'English'
                    target_language = 'Arabic'
                    sentence = row['sentence']
                    correct_translation = row['correct_translation']
                
                # Get mission ID based on difficulty and exercise count
                mission_id = get_mission_id_for_exercise(difficulty, exercise_counts[difficulty])
                
                # Create the exercise
                ReorderTranslationExercise.objects.create(
                    source_language=source_language,
                    target_language=target_language,
                    level=DIFFICULTY_MAPPING[difficulty],
                    points=POINTS_SETTINGS[difficulty],
                    sentence=sentence,
                    correct_translation=correct_translation,
                    pieces=pieces,
                    mission_id=mission_id,
                    topic=row['Topic_Label']
                )
                
                print(f"Created exercise: {source_language} -> {target_language}, "
                      f"Difficulty: {DIFFICULTY_MAPPING[difficulty]}, "
                      f"Topic: {row['Topic_Label']}, "
                      f"Mission ID: {mission_id}, "
                      f"Points: {POINTS_SETTINGS[difficulty]}")

if __name__ == "__main__":
    csv_file_path = 'ReorderTranslationExercise - ReorderTranslationExercise.csv.csv'
    import_exercises_from_csv(csv_file_path)