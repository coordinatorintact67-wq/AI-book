"""
Better Auth API Routes for FastAPI
Integrates Better Auth with FastAPI backend using PostgreSQL database
"""

import os
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import jwt
import hashlib
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment and initialize database locally to avoid circular import
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Local database initialization
if DATABASE_URL:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
else:
    engine = None
    SessionLocal = None
    Base = None

from models import User, Session as SessionModel

def get_db() -> Session:
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Router for auth endpoints
auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET_KEY", "your-super-secret-key-change-this")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


class SignUpRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    roboticsBackground: Optional[str] = None
    softwareExperience: Optional[str] = None
    hardwareExperience: Optional[str] = None
    learningGoals: Optional[str] = None
    educationLevel: Optional[str] = None


class SignInRequest(BaseModel):
    email: str
    password: str


def hash_password(password: str) -> str:
    """Hash password using SHA-256 (use bcrypt in production)"""
    return hashlib.sha256(password.encode()).hexdigest()


def create_jwt_token(user_id: int, email: str) -> str:
    """Create JWT token for session"""
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode = {
        "sub": str(user_id),
        "email": email,
        "exp": expire
    }
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


@auth_router.post("/sign-up/email")
async def sign_up(request: SignUpRequest, db: Session = Depends(get_db)):
    """Register a new user"""
    email = request.email.lower()

    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Create user
    user = User(
        email=email,
        password_hash=hash_password(request.password),
        name=request.name or email.split('@')[0],
        robotics_background=request.roboticsBackground,
        software_experience=request.softwareExperience,
        hardware_experience=request.hardwareExperience,
        learning_goals=request.learningGoals,
        education_level=request.educationLevel
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create session
    token = create_jwt_token(user.id, email)
    expires_at = datetime.utcnow() + timedelta(days=7)
    
    session = SessionModel(
        user_id=user.id,
        token=token,
        expires_at=expires_at
    )
    
    db.add(session)
    db.commit()

    return {
        "success": True,
        "user": {
            "id": user.id,
            "email": email,
            "name": user.name
        },
        "session": {
            "token": token
        }
    }


@auth_router.post("/sign-in/email")
async def sign_in(request: SignInRequest, db: Session = Depends(get_db)):
    """Sign in existing user"""
    email = request.email.lower()

    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if user.password_hash != hash_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create session
    token = create_jwt_token(user.id, email)
    expires_at = datetime.utcnow() + timedelta(days=7)
    
    session = SessionModel(
        user_id=user.id,
        token=token,
        expires_at=expires_at
    )
    
    db.add(session)
    db.commit()

    return {
        "success": True,
        "user": {
            "id": user.id,
            "email": email,
            "name": user.name
        },
        "session": {
            "token": token
        }
    }


@auth_router.post("/sign-out")
async def sign_out(db: Session = Depends(get_db)):
    """Sign out user (clear session)"""
    # In production, get token from request and invalidate it
    return {"success": True, "message": "Signed out successfully"}


@auth_router.get("/me")
async def get_current_user(db: Session = Depends(get_db)):
    """Get current authenticated user from JWT token"""
    # This would need token extraction from cookies/headers
    # For now, returns null - implement token validation as needed
    return {"user": None}


@auth_router.get("/get-session")
async def get_session(db: Session = Depends(get_db)):
    """Get current user session"""
    # This would validate token from cookies and return user info
    return {"user": None, "session": None}


@auth_router.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "roboticsBackground": user.robotics_background,
        "softwareExperience": user.software_experience,
        "hardwareExperience": user.hardware_experience,
        "learningGoals": user.learning_goals,
        "educationLevel": user.education_level,
        "createdAt": user.created_at.isoformat()
    }
