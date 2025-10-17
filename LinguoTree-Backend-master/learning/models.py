from django.db import models
from django.contrib.auth.models import User
import random

class ExerciseLevel(models.TextChoices):
    BEGINNER = 'Beginner', 'Beginner'
    INTERMEDIATE = 'Intermediate', 'Intermediate'
    ADVANCED = 'Advanced', 'Advanced'

class Language(models.TextChoices):
    ENGLISH = 'English', 'English'
    ARABIC = 'Arabic', 'Arabic'

class BaseExercise(models.Model):
    level = models.CharField(max_length=50, choices=ExerciseLevel.choices)
    source_language = models.CharField(max_length=50, choices=Language.choices)
    target_language = models.CharField(max_length=50, choices=Language.choices)
    points = models.PositiveIntegerField(default=10)
    topic = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        abstract = True


# class TranslationExercise(models.Model):
#     LEVEL_CHOICES = [
#         ('Beginner', 'Beginner'),
#         ('Intermediate', 'Intermediate'),
#         ('Advanced', 'Advanced'),
#     ]

#     LANGUAGE_CHOICES = [
#         ('English', 'English'),
#         ('Arabic', 'Arabic'),
#     ]

#     source_text = models.TextField()
#     target_text = models.TextField()
#     points = models.PositiveIntegerField(default=10)
#     difficulty_level = models.CharField(max_length=50, choices=LEVEL_CHOICES)
#     source_language = models.CharField(max_length=50, choices=LANGUAGE_CHOICES)
#     target_language = models.CharField(max_length=50, choices=LANGUAGE_CHOICES)

# class UserTranslationAttempt(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     exercise = models.ForeignKey(TranslationExercise, on_delete=models.CASCADE)
#     submitted_translation = models.TextField()
#     is_correct = models.BooleanField(default=False)
#     attempted_at = models.DateTimeField(auto_now_add=True)

class Mission(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    order = models.PositiveIntegerField(unique=True)  # Represents the order of the mission (e.g., 1 for "First Mission")
    level = models.CharField(max_length=50, choices=LEVEL_CHOICES)
    required_points = models.PositiveIntegerField()

    def __str__(self):
        return f"Mission {self.order} - {self.level}"
    
class Profile(models.Model):
    LANGUAGE_CHOICES = [
        ('English', 'English'),
        ('Arabic', 'Arabic'),
    ]

    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    learning_level = models.CharField(max_length=50, choices=LEVEL_CHOICES, default='Beginner')
    points = models.PositiveIntegerField(default=0)
    

class FillInTheBlankExercise(BaseExercise):
    sentence = models.TextField()
    missing_words = models.JSONField(blank=True, null=True)  # Store missing words as a list
    translation_of_sentence = models.CharField(max_length=500, blank=True, null=True)
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name="fill_in_the_blank_exercises")


class MultipleChoiceExercise(BaseExercise):
    sentence = models.TextField()
    correct_translation = models.TextField()
    choices = models.JSONField()  # Store choices as a list of translations
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name="multiple_choice_exercises")

class ReorderTranslationExercise(BaseExercise):
    sentence = models.TextField()  # Sentence in the source language
    correct_translation = models.TextField()  # The correct ordered translation
    pieces = models.JSONField(blank=True, null=True)  # JSON list of scrambled pieces
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name="reorder_translation_exercises")

    def save(self, *args, **kwargs):
        """
        Automatically generate pieces if not provided during save.
        """
        if not self.pieces:
            self.pieces = self._generate_pieces(self.correct_translation)
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_pieces(translation):
        """
        Splits the correct translation into logical pieces, shuffles them, and returns as a list.
        """
        words = translation.split()  # Split the translation into words
        random.shuffle(words)  # Shuffle the words
        return words

class LLMGeneratedQuestionExercise(BaseExercise):
    sentence = models.TextField()
    translation = models.TextField(blank=True, null=True)
    question = models.TextField()
    correct_answer = models.TextField()
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name="llm_generated_question_exercises")


# class PlacementTest(models.Model):
#     LEVEL_CHOICES = [
#         ('Beginner', 'Beginner'),
#         ('Intermediate', 'Intermediate'),
#         ('Advanced', 'Advanced'),
#     ]

#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     assigned_exercises = models.ManyToManyField('TranslationExercise')
#     completed = models.BooleanField(default=False)
#     result_level = models.CharField(max_length=50, choices=LEVEL_CHOICES, null=True, blank=True)
#     points = models.IntegerField(default=0)  # Tracks the points earned during the test
#     current_level = models.CharField(max_length=50, choices=LEVEL_CHOICES, default='Beginner')
#     current_index = models.IntegerField(default=0)  # Tracks the index of the current challenge
#     taken_at = models.DateTimeField(auto_now_add=True)


class Lesson(models.Model):
    DIFFICULTY_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    

class Challenge(models.Model):
    paragraph = models.TextField()  # The text to be translated
    source_language = models.CharField(
        max_length=50,
        choices=[
            ('English', 'English'),
            ('Arabic', 'Arabic'),
        ],
        default='English'
    )  # Language of the source text
    target_language = models.CharField(
        max_length=50,
        choices=[
            ('English', 'English'),
            ('Arabic', 'Arabic'),
        ],
        default='Arabic'
    )  # Language of the translation
    correct_translation = models.TextField()  # The correct translation
    points = models.PositiveIntegerField(default=10)  
    topic = models.CharField(max_length=255, blank=True, null=True)  # Optional
    timer_seconds = models.PositiveIntegerField()  # Timer duration in seconds
    difficulty_level = models.CharField(
        max_length=50,
        choices=[
            ('Beginner', 'Beginner'),
            ('Intermediate', 'Intermediate'),
            ('Advanced', 'Advanced'),
        ],
        default='Beginner'
    )
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set when the challenge is created
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)  # Optional

    def __str__(self):
        return f"Challenge {self.id}"
