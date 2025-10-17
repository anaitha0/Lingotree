import csv
from django.db import transaction
from learning.models import FillInTheBlankExercise

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
    'Beginner': range(63, 73),     # 63-72
    'Intermediate': range(73, 83),  # 73-82
    'Advanced': range(83, 93)       # 83-92
}

def get_mission_id_for_exercise(difficulty, exercise_count):
    """
    Returns appropriate mission ID based on difficulty and exercise count.
    Each mission should have 2 exercises.
    """
    mission_range = list(MISSION_RANGES[DIFFICULTY_MAPPING[difficulty]])
    mission_index = (exercise_count // 2) % len(mission_range)
    return mission_range[mission_index]

def process_missing_words(words_str):
    """
    Process the missing words string from CSV.
    Converts "word1, word2, word3" to ["word1", "word2", "word3"]
    """
    return [word.strip() for word in words_str.split(',')]

def detect_language(text):
    """
    Detect if text contains Arabic characters
    """
    return 'Arabic' if any('\u0600' <= char <= '\u06FF' for char in text) else 'English'

def import_exercises_from_csv(file_path):
    with transaction.atomic():
        exercise_counts = {'Easy': 0, 'Medium': 0, 'Hard': 0}
        
        with open(file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            
            for row in csv_reader:
                difficulty = row['Eng_Difficulty_Label']
                exercise_counts[difficulty] += 1
                
                # Process missing words
                missing_words = process_missing_words(row['missing_words'])
                
                # Determine source and target languages based on original sentence
                source_language = detect_language(row['original_sentence'])
                target_language = 'Arabic' if source_language == 'English' else 'English'
                
                # Get mission ID based on difficulty and exercise count
                mission_id = get_mission_id_for_exercise(difficulty, exercise_counts[difficulty])
                
                # Create the exercise
                FillInTheBlankExercise.objects.create(
                    source_language=source_language,
                    target_language=target_language,
                    level=DIFFICULTY_MAPPING[difficulty],
                    points=POINTS_SETTINGS[difficulty],
                    sentence=row['sentence'],
                    missing_words=missing_words,
                    translation_of_sentence=row['translated_sentence'],
                    mission_id=mission_id
                )
                
                print(f"Created exercise: {source_language} -> {target_language}, "
                      f"Difficulty: {DIFFICULTY_MAPPING[difficulty]}, "
                      f"Topic: {row['Topic_Label']}, "
                      f"Mission ID: {mission_id}, "
                      f"Points: {POINTS_SETTINGS[difficulty]}, "
                      f"Missing Words: {missing_words}")

if __name__ == "__main__":
    csv_file_path = '/home/marouaneoa/Documents/Semester VII/NLP/Project/translation_tool/CSV Database/FillInTheBlank - FillInTheBlank.csv.csv'  # Replace with actual path
    import_exercises_from_csv(csv_file_path)