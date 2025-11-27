from pydantic import BaseModel
from typing import Optional
from app.models.user import UserRole


class UserCreate(BaseModel):
    full_name: str
    email: str
    role: UserRole   # enforce enum
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserRead(BaseModel):
    id: str                     # IMPORTANT: ObjectId converted to string
    full_name: str
    email: str
    role: UserRole
    is_active: bool = True

    class Config:
        from_attributes = True 
        json_encoders={
            # convert ObjectId to string automatically
            # ONLY works with pydantic v2 style
            # but good practice to include
        } # Pydantic v2 replacement for orm_mode



class Token(BaseModel):
    access_token: str

class DashboardResponse(BaseModel):
    message: str
    role: UserRole
    data: dict

    class Config:
        from_attributes = True
