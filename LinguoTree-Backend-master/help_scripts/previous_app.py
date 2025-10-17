"""
# List and Create Translation Exercises
class TranslationExerciseListCreateView(View):
    def get(self, request):
        exercises = TranslationExercise.objects.all()
        data = [{
            'id': ex.id,
            'source_text': ex.source_text,
            'target_text': ex.target_text,
            'difficulty_level': ex.difficulty_level,
            'source_language': ex.source_language,
            'target_language': ex.target_language,
        } for ex in exercises]
        return JsonResponse(data, safe=False)

    def post(self, request):
        data = request.POST
        exercise = TranslationExercise.objects.create(
            source_text=data['source_text'],
            target_text=data['target_text'],
            difficulty_level=data['difficulty_level'],
            source_language=data['source_language'],
            target_language=data['target_language'],
        )
        return JsonResponse({'message': 'Exercise created successfully', 'exercise_id': exercise.id})

class StartPlacementTestView(View):
    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)

        # Check if a placement test already exists for the user
        if PlacementTest.objects.filter(user=user, completed=False).exists():
            return JsonResponse({'error': 'Placement test already in progress'}, status=400)

        # Assign 10 exercises per level
        beginner_exercises = TranslationExercise.objects.filter(difficulty_level='Beginner')[:10]
        intermediate_exercises = TranslationExercise.objects.filter(difficulty_level='Intermediate')[:10]
        advanced_exercises = TranslationExercise.objects.filter(difficulty_level='Advanced')[:10]

        # Create Placement Test
        placement_test = PlacementTest.objects.create(user=user)
        placement_test.assigned_exercises.set(beginner_exercises | intermediate_exercises | advanced_exercises)
        placement_test.save()

        return JsonResponse({'message': 'Placement test started', 'test_id': placement_test.id})

class ProgressPlacementTestView(View):
    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        placement_test = get_object_or_404(PlacementTest, user=user, completed=False)

        # Get the current exercise
        exercises = placement_test.assigned_exercises.all()
        if placement_test.current_index >= len(exercises):
            return JsonResponse({'message': 'All challenges completed'}, status=400)

        current_exercise = exercises[placement_test.current_index]

        # Process the user's response
        data = request.body.decode('utf-8')
        user_translation = data.get('user_translation', '')
        is_correct = user_translation == current_exercise.target_text

        # Update points and level
        if is_correct:
            placement_test.points += 10

        placement_test.current_index += 1

        # Advance to the next level
        if placement_test.current_index == 10:
            placement_test.current_level = 'Intermediate'
        elif placement_test.current_index == 20:
            placement_test.current_level = 'Advanced'

        # Mark test as completed if all challenges are done
        if placement_test.current_index == len(exercises):
            placement_test.completed = True
            if placement_test.points < 50:
                placement_test.result_level = 'Beginner'
            elif placement_test.points < 100:
                placement_test.result_level = 'Intermediate'
            else:
                placement_test.result_level = 'Advanced'

        placement_test.save()

        return JsonResponse({
            'current_exercise': {
                'source_text': current_exercise.source_text,
                'source_language': current_exercise.source_language,
                'target_language': current_exercise.target_language,
            },
            'is_correct': is_correct,
            'points': placement_test.points,
            'next_level': placement_test.current_level if not placement_test.completed else None,
            'completed': placement_test.completed
        })

# User Progress Tracking
class UserProgressView(View):
    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        attempts = UserTranslationAttempt.objects.filter(user=user)
        data = [{
            'exercise_id': attempt.exercise.id,
            'submitted_translation': attempt.submitted_translation,
            'is_correct': attempt.is_correct,
            'attempted_at': attempt.attempted_at,
        } for attempt in attempts]
        return JsonResponse(data, safe=False)
"""