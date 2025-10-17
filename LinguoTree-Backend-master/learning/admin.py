from django.contrib import admin
from .models import Profile,  Lesson, Challenge, Mission
from .models import FillInTheBlankExercise, MultipleChoiceExercise, ReorderTranslationExercise, LLMGeneratedQuestionExercise

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'learning_level')

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'content', 'difficulty_level')

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('id', 'paragraph', 'source_language', 'target_language', 'difficulty_level', 'correct_translation', 'timer_seconds', 'topic')    

@admin.register(FillInTheBlankExercise)
class FillInTheBlankExerciseAdmin(admin.ModelAdmin):
    list_display = ('id', 'sentence', 'missing_words', 'translation_of_sentence', 'mission')

@admin.register(MultipleChoiceExercise)
class MultipleChoiceExerciseAdmin(admin.ModelAdmin):
    list_display = ('id', 'sentence', 'correct_translation', 'choices', 'mission')

@admin.register(ReorderTranslationExercise)
class ReorderTranslationExerciseAdmin(admin.ModelAdmin):
    list_display = ('id', 'sentence', 'correct_translation', 'pieces', 'mission', 'topic')

@admin.register(LLMGeneratedQuestionExercise)
class LLMGeneratedQuestionExerciseAdmin(admin.ModelAdmin):
    list_display = ('id', 'sentence', 'translation', 'question', 'correct_answer', 'mission')

@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'level', 'required_points')