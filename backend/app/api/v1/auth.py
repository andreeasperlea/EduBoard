# app/api/v1/auth.py
from fastapi import APIRouter, HTTPException, status, Depends
from app.models import User
from app.schemas.user import UserCreate, UserLogin, UserRead, Token, UserUpdate
from app.utils.password import hash_password, verify_password
from app.core.security import create_access_token
from app.api.deps import get_current_user

router = APIRouter(tags=["Authentication"])

@router.post("/register", response_model=UserRead)
async def register(user_in: UserCreate):

    existing = await User.find_one(User.email == user_in.email)
    if existing:
        raise HTTPException(
            status_code=400, 
            detail="Email already registered. Please log in."
        )

  
    if len(user_in.password) < 6:
        raise HTTPException(
            status_code=400, 
            detail="Password must be at least 6 characters long."
        )
    
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

    user = await User.find_one(User.email == user_in.email)
    
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=401, 
            detail="Incorrect email or password."
        )

    token = create_access_token(
        {"sub": str(user.id), "role": user.role.value}
    )

    return Token(access_token=token)


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    data = current_user.model_dump()
    data["id"] = str(current_user.id)
    return UserRead(**data)


#creat inca o functie pentru a da update la datele contului
@router.patch("/me", response_model=UserRead)
async def update_me(
    user_update: UserUpdate,
    current_user: User =  Depends(get_current_user)
):
    update_data = user_update.dict(exclude_unset=True)

    if update_data:
        await current_user.set(update_data)

    data = current_user.dict()
    data["id"] = str(current_user.id)
    return UserRead(**data)