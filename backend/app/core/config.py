from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_JWT_SECRET: str
    OPENROUTER_API_KEY: str
    OPENROUTER_LLM_MODEL: str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
