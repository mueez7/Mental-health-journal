import json
from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENROUTER_API_KEY,
)

def analyze_journal_entry(text: str) -> dict:
    prompt = """You are an empathetic, clinical AI. Analyze this journal entry. 
Return a JSON object strictly following this schema without any markdown blocks or extra text:
{
    "title": "A short, 2-4 word title",
    "tags": ["Array of max 3 emotion/topic tags"],
    "suggestion": "One sentence actionable advice based on the entry",
    "type": "deep" if the entry is very thoughtful/long else "quick",
    "mood_score": integer between 1 and 10,
    "stress_score": integer between 1 and 10
}

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
