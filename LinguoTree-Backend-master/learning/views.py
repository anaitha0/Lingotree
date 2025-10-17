from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.views import View
from rest_framework import status
from .models import Profile
from .models import Lesson
from .models import Mission, FillInTheBlankExercise, MultipleChoiceExercise, ReorderTranslationExercise, LLMGeneratedQuestionExercise
from .models import Challenge
from .serializers import ChallengeSerializer
from rest_framework.views import APIView
from .serializers import LessonSerializer
# import json


class RegisterUserView(APIView):
    """
    Handles user registration.
    """
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            username = data.get("username")
            password = data.get("password")

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(username=username, password=password)
            user.save()

            return JsonResponse({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginUserView(APIView):
    """
    Handles user login.
    """
    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get("username")
        password = data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login successful"}, status=status.HTTP_200_OK)
        return JsonResponse({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    """
    Fetches the user's profile.
    Requires authentication.
    """
    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
            data = {
                "username": user.username,
                "learning_level": profile.learning_level,
                "points": profile.points,
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return JsonResponse({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

class MissionListView(View):
    def get(self, request):
        missions = Mission.objects.all().order_by('order')
        mission_data = [
            {
                "id": mission.id,
                "order": mission.order,
                "level": mission.level,
                "required_points": mission.required_points,
            }
            for mission in missions
        ]
        return JsonResponse(mission_data, safe=False)

class MissionDetailView(View):
    def get(self, request, mission_order):
        mission = get_object_or_404(Mission, order=mission_order)
        
        exercises = {
            "fill_in_the_blank_exercises": list(mission.fill_in_the_blank_exercises.values(
                "id", "sentence", "missing_words", "translation_of_sentence", "topic"
            )),
            "multiple_choice_exercises": list(mission.multiple_choice_exercises.values(
                "id", "sentence", "correct_translation", "choices", "topic"
            )),
            "reorder_translation_exercises": list(mission.reorder_translation_exercises.values(
                "id", "sentence", "pieces", "correct_translation", "topic"
            )),
            "llm_generated_question_exercises": list(mission.llm_generated_question_exercises.values(
                "id", "sentence", "translation", "question", "correct_answer", "topic"
            )),
        }

        mission_data = {
            "id": mission.id,
            "order": mission.order,
            "level": mission.level,
            "required_points": mission.required_points,
            "exercises": exercises,
        }
        return JsonResponse(mission_data)
    
class ExerciseListView(View):
    def get(self, request):
        fill_in_the_blank = list(FillInTheBlankExercise.objects.values(
            "id", "sentence", "missing_words", "translation_of_sentence", "mission_id", "topic", "points", "level"
        ))
        multiple_choice = list(MultipleChoiceExercise.objects.values(
            "id", "sentence", "correct_translation", "choices", "mission_id", "topic", "points", "level"
        ))
        reorder_translation = list(ReorderTranslationExercise.objects.values(
            "id", "sentence", "pieces", "correct_translation", "mission_id", "topic", "points", "level"
        ))
        llm_generated = list(LLMGeneratedQuestionExercise.objects.values(
            "id", "sentence", "translation", "question", "correct_answer", "mission_id", "topic", "points", "level"
        ))

        data = {
            "fill_in_the_blank": fill_in_the_blank,
            "multiple_choice": multiple_choice,
            "reorder_translation": reorder_translation,
            "llm_generated": llm_generated,
        }

        return JsonResponse(data)

class LessonListView(APIView):
    def get(self, request, *args, **kwargs):
        lessons = Lesson.objects.all()
        serializer = LessonSerializer(lessons, many=True)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LessonDetailView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            lesson = Lesson.objects.get(pk=pk)
            serializer = LessonSerializer(lesson)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        except Lesson.DoesNotExist:
            return JsonResponse({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, *args, **kwargs):
        try:
            lesson = Lesson.objects.get(pk=pk)
            serializer = LessonSerializer(lesson, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=status.HTTP_200_OK)
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Lesson.DoesNotExist:
            return JsonResponse({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk, *args, **kwargs):
        try:
            lesson = Lesson.objects.get(pk=pk)
            lesson.delete()
            return JsonResponse({"message": "Lesson deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Lesson.DoesNotExist:
            return JsonResponse({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)


class ChallengeListCreateView(APIView):

    def get(self, request):
        challenges = Challenge.objects.all()
        serializer = ChallengeSerializer(challenges, many=True)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ChallengeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChallengeDetailView(APIView):

    def get(self, request, pk):
        try:
            challenge = Challenge.objects.get(pk=pk)
            serializer = ChallengeSerializer(challenge)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        except Challenge.DoesNotExist:
            return JsonResponse({'error': 'Challenge not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            challenge = Challenge.objects.get(pk=pk)
            if challenge.created_by != request.user:
                return JsonResponse({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
            challenge.delete()
            return JsonResponse({'message': 'Challenge deleted'}, status=status.HTTP_200_OK)
        except Challenge.DoesNotExist:
            return JsonResponse({'error': 'Challenge not found'}, status=status.HTTP_404_NOT_FOUND)
        
class AddPointsView(APIView):
    def post(self, request, username):
        user = get_object_or_404(User, username=username)
        data = request.data
        exercise_id = data.get('exercise_id')
        exercise_type = data.get('exercise_type')
        is_correct = 'true'

        if not exercise_id or not exercise_type or is_correct is None:
            return JsonResponse({'error': 'Invalid dataaa'}, status=400)

        # Determine exercise model
        exercise_model = {
            'fill_in_the_blank': FillInTheBlankExercise,
            'multiple_choice': MultipleChoiceExercise,
            'reorder_translation': ReorderTranslationExercise,
            'llm_generated': LLMGeneratedQuestionExercise
        }.get(exercise_type)

        if not exercise_model:
            return JsonResponse({'error': 'Invalid exercise type'}, status=400)

        # Get the exercise and points
        exercise = get_object_or_404(exercise_model, id=exercise_id)
        if is_correct == 'true':  # assuming the client sends 'true' or 'false' as strings
            user.profile.points += exercise.points
            # update the user's level based on points
            if user.profile.points < 600:
                user.profile.learning_level = 'Beginner'
            elif user.profile.points < 1800:
                user.profile.learning_level = 'Intermediate'
            else:
                user.profile.learning_level = 'Advanced'
            user.profile.save()
            return JsonResponse({'message': 'Points added successfully', 'total_points': user.profile.points})
        else:
            return JsonResponse({'message': 'No points added', 'total_points': user.profile.points})
        
import random

EXERCISE_MODELS = [
    FillInTheBlankExercise,
    MultipleChoiceExercise,
    ReorderTranslationExercise,
    LLMGeneratedQuestionExercise,
]

QUESTIONS_PER_LEVEL = 12
QUESTIONS_PER_TYPE = 3
REQUIRED_CORRECT_ANSWERS = 9
POINTS_PER_LEVEL = {
    'Beginner': 600,
    'Intermediate': 1200,
    'Advanced': 1800,
}


class PlacementTestView(View):
    def get(self, request):
        """
        Fetch questions for the placement test. The test will progress through Beginner, Intermediate, and Advanced levels.
        """
        level = request.GET.get('current_level', 'Beginner')  # Default to Beginner if not provided
        levels = ['Beginner', 'Intermediate', 'Advanced']

        if level not in levels:
            return JsonResponse({'error': 'Invalid level'}, status=400)

        questions = []
        for model in EXERCISE_MODELS:
            exercises = model.objects.filter(difficulty_level=level).order_by('?')[:QUESTIONS_PER_TYPE]
            questions.extend([
                {
                    'id': exercise.id,
                    'type': model.__name__,
                    'content': self.get_exercise_content(exercise)
                } for exercise in exercises
            ])

        random.shuffle(questions)  # Randomize question order
        return JsonResponse({'level': level, 'questions': questions})

    def post(self, request):
        """
        Process answers and determine the user's level.
        """
        data = request.POST
        current_level = data.get('current_level', 'Beginner')  # Default to Beginner
        levels = ['Beginner', 'Intermediate', 'Advanced']

        if current_level not in levels:
            return JsonResponse({'error': 'Invalid level'}, status=400)

        answers = data.getlist('answers', [])
        if len(answers) != QUESTIONS_PER_LEVEL:
            return JsonResponse({'error': 'Incorrect number of answers'}, status=400)

        correct_count = sum(1 for answer in answers if answer['is_correct'])  # Simulating validation

        if correct_count >= REQUIRED_CORRECT_ANSWERS:
            # Calculate points for the current level
            points = POINTS_PER_LEVEL[current_level]
            request.user.profile.points += points
            # Update the user's level
            if request.user.profile.points < 600:
                request.user.profile.learning_level = 'Beginner'
            elif request.user.profile.points < 1800:
                request.user.profile.learning_level = 'Intermediate'
            else:
                request.user.profile.learning_level = 'Advanced'
            request.user.profile.save()

            # Proceed to the next level if any
            next_level_index = levels.index(current_level) + 1
            if next_level_index < len(levels):
                next_level = levels[next_level_index]
                return JsonResponse({
                    'message': f'You passed the {current_level} level and earned {points} points!',
                    'next_level': next_level,
                    'points': request.user.profile.points
                })

            return JsonResponse({
                'message': f'Congratulations! You completed the placement test and earned {points} points!',
                'final_level': current_level,
                'points': request.user.profile.points
            })

        # If the user does not pass the level, finalize their level
        return JsonResponse({
            'message': f'Placement test completed. Your level is {current_level}.',
            'final_level': current_level,
            'points': request.user.profile.points
        })

    def get_exercise_content(self, exercise):
        """
        Format exercise content for display.
        """
        if isinstance(exercise, FillInTheBlankExercise):
            return {'sentence': exercise.sentence, 'translation_of_sentence': exercise.translation_of_sentence}
        elif isinstance(exercise, MultipleChoiceExercise):
            return {'sentence': exercise.sentence, 'choices': exercise.choices}
        elif isinstance(exercise, ReorderTranslationExercise):
            return {'sentence': exercise.sentence, 'pieces': exercise.pieces}
        elif isinstance(exercise, LLMGeneratedQuestionExercise):
            return {'sentence': exercise.sentence, 'question': exercise.question}
        return {}
    
