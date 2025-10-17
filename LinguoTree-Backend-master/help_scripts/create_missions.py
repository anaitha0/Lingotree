from django.db import transaction
from learning.models import Mission

LEVELS = ['Beginner', 'Intermediate', 'Advanced']

REQUIRED_POINTS_INCREMENT = {
    'Beginner': 60,
    'Intermediate': 120,
    'Advanced': 180,
}

POINTS_PER_EXERCISE = 10
MISSIONS_PER_LEVEL = 10

def create_missions():
    with transaction.atomic():  # Ensure all operations are atomic
        required_points = 0
        for level_index, level in enumerate(LEVELS):
            
            for mission_order in range(1, MISSIONS_PER_LEVEL + 1):
                # Calculate the global order (1-30 instead of 1-10 for each level)
                global_order = (level_index * MISSIONS_PER_LEVEL) + mission_order
                
                # Create the mission with current required_points
                Mission.objects.create(
                    order=global_order,  # Assign unique global order
                    level=level,
                    required_points=required_points,
                )
                
                print(f"Created Mission {global_order} (Level: {level}, Level Order: {mission_order}) "
                      f"with required points: {required_points}")
                
                # Update required points for the next mission
                required_points += REQUIRED_POINTS_INCREMENT[level]


if __name__ == "__main__":
    create_missions()