# app/api/v1/auth.py
from fastapi import APIRouter, HTTPException, status, Depends

from app.models import User, UserRole
from app.schemas.user import UserCreate, UserLogin, UserRead, Token
from app.utils.password import hash_password, verify_password
from app.core.security import create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserRead)
async def register(user_in: UserCreate):

    existing = await User.find_one(User.email == user_in.email)
    if existing:
        raise HTTPException(400, "Email already registered")

    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        role=user_in.role,
        hashed_password=hash_password(user_in.password),
    )

    await user.insert()


    data = user.model_dump()
    data["id"] = str(user.id)

    return UserRead(**data)



@router.post("/login", response_model=Token)
async def login(user_in: UserLogin):

    # Find user
    user = await User.find_one(User.email == user_in.email)
    if not user:
        raise HTTPException(401, "Incorrect email or password")

    # Check password
    if not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(401, "Incorrect email or password")

    # Create token
    token = create_access_token(
        {"sub": str(user.id), "role": user.role.value}
    )

    return Token(access_token=token)

@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):

    data = current_user.model_dump()
    data["id"] = str(current_user.id)  # <-- FIX

    return UserRead(**data)
