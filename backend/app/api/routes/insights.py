from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.services.db_service import get_supabase_client

router = APIRouter()

@router.get("/")
def get_insights(days: int = 30, user: dict = Depends(get_current_user)):
    client = get_supabase_client(user["token"])
    res = client.table("journal_entries").select("created_at, mood_score, stress_score").order("created_at", desc=False).execute()
    
    mood_data = []
    for i, e in enumerate(res.data):
        mood_data.append({
            "day": f"Entry {i+1}",
            "mood": e.get("mood_score") or 5,
            "stress": e.get("stress_score") or 5
        })
        
    return {
        "mood_data": mood_data[-days:],
        "themes": [
            { "name": "Reflective", "score": 80, "color": "#E8C84D" },
            { "name": "Creative", "score": 60, "color": "#8AA2C8" }
        ],
        "areas_for_growth": "Your recent entries highlight anticipation.",
        "growth_suggestion": "Practice grounding exercises.",
        "positive_highlights": "You experience strong sense of flow.",
        "positive_suggestion": "Keep protecting these blocks."
    }
