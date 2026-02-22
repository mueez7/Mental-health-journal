from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Optional
from app.schemas.schemas import JournalEntryCreate, JournalEntry
from app.api.deps import get_current_user
from app.services.llm_service import analyze_journal_entry
from app.services.db_service import get_supabase_client

router = APIRouter()

@router.post("/", response_model=JournalEntry)
def create_entry(entry: JournalEntryCreate, user: dict = Depends(get_current_user)):
    analysis = analyze_journal_entry(entry.text)
    client = get_supabase_client(user["token"])
    
    data = {
        "user_id": user["user_id"],
        "title": analysis.get("title", "New Entry"),
        "text": entry.text,
        "entry_type": analysis.get("type", "quick"),
        "tags": analysis.get("tags", []),
        "suggestion": analysis.get("suggestion", ""),
        "mood_score": analysis.get("mood_score", 5),
        "stress_score": analysis.get("stress_score", 5),
        "time_spent": entry.time_spent
    }
    
    res = client.table("journal_entries").insert(data).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to save entry")
    
    return res.data[0]

@router.get("/", response_model=List[JournalEntry])
def get_entries(
    search: Optional[str] = None,
    filter: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    client = get_supabase_client(user["token"])
    query = client.table("journal_entries").select("*").order("created_at", desc=True)
    
    if search:
        query = query.ilike("text", f"%{search}%")
        
    res = query.execute()
    entries = res.data
    
    if filter and filter.lower() != "all":
        f = filter.lower()
        entries = [e for e in entries if e.get("entry_type", "").lower() == f or any(t.lower() == f for t in e.get("tags", []))]
    
    return entries
