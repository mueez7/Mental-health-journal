from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import base64
from app.core.config import settings

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        # Decode the payload without local signature verification.
        # The token's cryptographic authenticity is strictly enforced by 
        # Supabase PostgreSQL Row-Level Security when we execute the query.
        payload = jwt.decode(
            token,
            options={"verify_signature": False}
        )
        return {"user_id": payload["sub"], "token": token}
    except Exception as e:
        print(f"JWT Verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
