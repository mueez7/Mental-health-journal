from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.services.db_service import get_supabase_client

router = APIRouter()

@router.get("/")
def get_dashboard_stats(user: dict = Depends(get_current_user)):
    client = get_supabase_client(user["token"])
    res = client.table("journal_entries").select("id, created_at").order("created_at", desc=True).execute()
    
    entries = res.data
    total_entries = len(entries)
    
    return {
        "streak": 1 if total_entries > 0 else 0,
        "total_entries": total_entries,
        "recent_entries": entries[:5]
    }
