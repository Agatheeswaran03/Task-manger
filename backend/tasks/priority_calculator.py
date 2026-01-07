"""
Eisenhower Matrix Priority Calculator

Quadrants:
- Q1: Urgent + Important (Do First) - High urgency (3-4), High importance (3-4)
- Q2: Not Urgent + Important (Schedule) - Low urgency (1-2), High importance (3-4)
- Q3: Urgent + Not Important (Delegate) - High urgency (3-4), Low importance (1-2)
- Q4: Not Urgent + Not Important (Eliminate) - Low urgency (1-2), Low importance (1-2)
"""


def calculate_priority_quadrant(urgency: int, importance: int) -> str:
    """
    Calculate Eisenhower Matrix quadrant based on urgency and importance.
    
    Args:
        urgency: 1-4 scale
        importance: 1-4 scale
    
    Returns:
        Quadrant string: 'Q1', 'Q2', 'Q3', or 'Q4'
    """
    is_urgent = urgency >= 3
    is_important = importance >= 3
    
    if is_urgent and is_important:
        return 'Q1'  # Do First
    elif not is_urgent and is_important:
        return 'Q2'  # Schedule
    elif is_urgent and not is_important:
        return 'Q3'  # Delegate
    else:
        return 'Q4'  # Eliminate


def calculate_priority_score(urgency: int, importance: int, quadrant: str) -> int:
    """
    Calculate priority score for sorting tasks.
    Higher score = higher priority.
    
    Args:
        urgency: 1-4 scale
        importance: 1-4 scale
        quadrant: 'Q1', 'Q2', 'Q3', or 'Q4'
    
    Returns:
        Priority score (higher = more priority)
    """
    # Base score from quadrant (Q1 highest, Q4 lowest)
    quadrant_scores = {
        'Q1': 1000,
        'Q2': 700,
        'Q3': 400,
        'Q4': 100
    }
    
    base_score = quadrant_scores.get(quadrant, 0)
    
    # Add urgency and importance as multipliers
    # This ensures tasks within same quadrant are further sorted
    urgency_bonus = urgency * 10
    importance_bonus = importance * 5
    
    total_score = base_score + urgency_bonus + importance_bonus
    
    return total_score


def get_quadrant_label(quadrant: str) -> str:
    """Get human-readable label for quadrant"""
    labels = {
        'Q1': 'Do First',
        'Q2': 'Schedule',
        'Q3': 'Delegate',
        'Q4': 'Eliminate'
    }
    return labels.get(quadrant, 'Unknown')


def get_quadrant_color(quadrant: str) -> str:
    """Get color code for quadrant (for UI)"""
    colors = {
        'Q1': '#FF6B6B',  # Red - urgent and important
        'Q2': '#4ECDC4',  # Teal - important but not urgent
        'Q3': '#FFE66D',  # Yellow - urgent but not important
        'Q4': '#95A5A6'   # Gray - neither urgent nor important
    }
    return colors.get(quadrant, '#95A5A6')

