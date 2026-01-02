from pydantic import BaseModel
from typing import Optional
from app.models.user import UserRole


class UserCreate(BaseModel):
    full_name: str
    email: str
    role: UserRole 
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserRead(BaseModel):
    id: str                   
    full_name: str
    email: str
    role: UserRole
    is_active: bool = True

    avatar_color: str = "#FF80ED"

    class Config:
        from_attributes = True 
        json_encoders={
           
        } 



class Token(BaseModel):
    access_token: str

class DashboardResponse(BaseModel):
    message: str
    role: UserRole
    data: dict

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    avatar_color: Optional[str] = None

