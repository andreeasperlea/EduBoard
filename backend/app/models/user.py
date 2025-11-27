from beanie import Document
from enum import Enum

class UserRole(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"

class User(Document):
    full_name: str
    email: str
    role: UserRole
    hashed_password: str
    is_active: bool = True

    class Settings:
        name = "users"
