from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import entries, dashboard, insights

app = FastAPI(title="Lumina Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(entries.router, prefix="/api/v1/entries", tags=["entries"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(insights.router, prefix="/api/v1/insights", tags=["insights"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
