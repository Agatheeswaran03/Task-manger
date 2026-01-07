import os
from openai import OpenAI
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY or os.getenv('OPENAI_API_KEY', ''))


def analyze_task(task_description: str) -> dict:
    """
    Analyze task description using OpenAI to determine urgency and importance.
    Returns a dictionary with urgency, importance, and context.
    """
    if not task_description:
        return {
            'urgency': 2,
            'importance': 2,
            'context': 'No description provided'
        }
    
    prompt = f"""Analyze the following task and rate it on two scales from 1 to 4:

Task: {task_description}

Rate the task on:
1. Urgency (1=Not urgent, 2=Somewhat urgent, 3=Urgent, 4=Very urgent)
2. Importance (1=Not important, 2=Somewhat important, 3=Important, 4=Very important)

Consider:
- Urgency: deadlines, time-sensitive nature, immediate consequences
- Importance: long-term impact, strategic value, alignment with goals

Respond ONLY in this exact JSON format:
{{
    "urgency": <number 1-4>,
    "importance": <number 1-4>,
    "reasoning": "<brief explanation>"
}}"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a task prioritization assistant. Analyze tasks and provide urgency and importance ratings."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=150
        )
        
        import json
        result_text = response.choices[0].message.content.strip()
        
        # Try to extract JSON from response
        if result_text.startswith('```json'):
            result_text = result_text.replace('```json', '').replace('```', '').strip()
        elif result_text.startswith('```'):
            result_text = result_text.replace('```', '').strip()
        
        result = json.loads(result_text)
        
        return {
            'urgency': int(result.get('urgency', 2)),
            'importance': int(result.get('importance', 2)),
            'context': result.get('reasoning', 'AI analysis completed')
        }
    except Exception as e:
        # Fallback to default values if API fails
        print(f"OpenAI API error: {str(e)}")
        return {
            'urgency': 2,
            'importance': 2,
            'context': f'Analysis failed: {str(e)}'
        }

