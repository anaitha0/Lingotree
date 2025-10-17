"""
Method: GET
URL: /missions/
"""

[
    {
        "id": 1,
        "order": 1,
        "level": "Beginner",
        "required_points": 100
    },
    {
        "id": 2,
        "order": 2,
        "level": "Intermediate",
        "required_points": 200
    }
]

"""
Method: GET
URL: /missions/1/
"""

{
    "id": 1,
    "order": 1,
    "level": "Beginner",
    "required_points": 100,
    "exercises": {
        "fill_in_the_blank_exercises": [
            {
                "id": 1,
                "sentence": "This is a [missing word] sentence.",
                "missing_word": "sample",
                "translation_of_missing_word": "عينة"
            }
        ],
        "multiple_choice_exercises": [
            {
                "id": 2,
                "sentence": "Translate this sentence.",
                "correct_translation": "ترجم هذه الجملة.",
                "choices": ["ترجم هذا", "ترجم هذه الجملة.", "هذا مثال."]
            }
        ],
        "reorder_translation_exercises": [],
        "llm_generated_question_exercises": []
    }
}

"""
Method: GET
URL: /exercises/
"""
{
    "fill_in_the_blank": [
        {
            "id": 1,
            "sentence": "This is a [missing word] sentence.",
            "missing_word": "sample",
            "translation_of_missing_word": "عينة",
            "mission_id": 1
        }
    ],
    "multiple_choice": [
        {
            "id": 2,
            "sentence": "Translate this sentence.",
            "correct_translation": "ترجم هذه الجملة.",
            "choices": ["ترجم هذا", "ترجم هذه الجملة.", "هذا مثال."],
            "mission_id": 1
        }
    ],
    "reorder_translation": [],
    "llm_generated": []
}

"""
Method: POST
URL: /add-points/<int:user_id>/
Body:
"""
{
    "exercise_id": 1,
    "exercise_type": "fill_in_the_blank",
    "is_correct": "true"
}

"""
Response:
"""
{
    "message": "Points added successfully",
    "total_points": 100
}

"""
Method: GET
URL: /placement-test/start/?current_level=Beginner
Response:
"""
{
  "level": "Beginner",
  "questions": [
    {
      "id": 1,
      "type": "FillInTheBlankExercise",
      "content": {
        "sentence": "The ___ is shining today.",
        "missing_word_translation": "sun"
      }
    },
    {
      "id": 2,
      "type": "MultipleChoiceExercise",
      "content": {
        "sentence": "Translate: 'Hello, how are you?'",
        "choices": [
          "مرحبا، كيف حالك؟",
          "أين أنت؟",
          "شكرا جزيلا"
        ]
      }
    },
    {
      "id": 3,
      "type": "ReorderTranslationExercise",
      "content": {
        "sentence": "The cat is on the roof.",
        "pieces": ["on", "roof", "is", "The", "cat", "the"]
      }
    },
    {
      "id": 4,
      "type": "LLMGeneratedQuestionExercise",
      "content": {
        "sentence": "The weather is beautiful today.",
        "question": "What is the weather like today?"
      }
    }
  ]
}
"""
Method: POST
URL: /placement-test/start/
"""
{
  "current_level": "Beginner",
  "answers": [
    {"id": 1, "type": "FillInTheBlankExercise", "is_correct": true},
    {"id": 2, "type": "MultipleChoiceExercise", "is_correct": false},
    {"id": 3, "type": "ReorderTranslationExercise", "is_correct": true},
    {"id": 4, "type": "LLMGeneratedQuestionExercise", "is_correct": true}
  ]
}
"""
Response if Passed:
"""
{
  "message": "You passed the Beginner level and earned 600 points!",
  "next_level": "Intermediate",
  "points": 600
}
"""
Response if Failed:
"""
{
  "message": "Placement test completed. Your level is Beginner.",
  "final_level": "Beginner",
  "points": 300
}
