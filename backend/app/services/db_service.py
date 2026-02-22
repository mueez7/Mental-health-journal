from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client(token: str) -> Client:
    client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    # Configure the client to use the user's token so RLS is enforced
    try:
        client.postgrest.auth(token)
    except Exception as e:
        print(f"Error authenticating with Supabase: {e}")
    return client

def get_supabase_admin() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
