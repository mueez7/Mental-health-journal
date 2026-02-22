from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class JournalEntryCreate(BaseModel):
    text: str
    time_spent: int

class JournalEntry(BaseModel):
    id: str
    user_id: str
    title: str
    text: str
    entry_type: str
    tags: List[str]
    suggestion: Optional[str]
    mood_score: Optional[int]
    stress_score: Optional[int]
    time_spent: int
    created_at: datetime
    updated_at: datetime
