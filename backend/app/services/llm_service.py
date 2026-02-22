import json
from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENROUTER_API_KEY,
)

def analyze_journal_entry(text: str) -> dict:
    prompt = """You are a highly empathetic, emotionally intelligent mental health journaling assistant with clinical awareness (not a therapist). 
Your role is to carefully analyze the user's journal entry for emotional tone, stress level, and underlying themes.

Respond with a JSON object that STRICTLY follows the schema below.
Do NOT include markdown, explanations, disclaimers, or any extra text outside the JSON.
Ensure all fields are present and values are realistic, grounded, and internally consistent.

{
    "title": "A concise, meaningful 2-4 word title that captures the emotional core",
    "tags": ["Up to 3 relevant emotion or mental state tags (e.g., anxiety, burnout, hope, loneliness)"],
    "suggestion": "One or two sentences of gentle, actionable, and emotionally supportive advice based only on the journal content",
    "type": "deep" if the entry reflects extended reflection, complexity, or emotional depth, otherwise "quick",
    "mood_score": integer between 1 and 10 where 1 = very low mood and 10 = very positive mood,
    "stress_score": integer between 1 and 10 where 1 = very calm and 10 = extremely stressed
}

Guidelines:
- Be warm, validating, and non-judgmental.
- Do not diagnose or label the user.
- Suggestions should be practical, small, and safe (e.g., reflection, grounding, rest, journaling, reaching out).
- Infer scores thoughtfully from language, tone, and emotional intensity.

Journal Entry:
""" + text

    try:
        response = client.chat.completions.create(
            model=settings.OPENROUTER_LLM_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"Error calling LLM: {e}")
        return {
            "title": "Journal Entry",
            "tags": ["Reflective"],
            "suggestion": "Take a moment to breathe and reflect.",
            "type": "quick" if len(text) < 200 else "deep",
            "mood_score": 5,
            "stress_score": 5
        }
