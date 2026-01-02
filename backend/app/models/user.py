from beanie import Document
from enum import Enum
from typing import Optional


class UserRole(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"

class User(Document):
    full_name: str
    email: str
    role: UserRole
    hashed_password: str
    is_active: bool = True

    avatar_color: str ="#FF80ED"

    class Settings:
        name = "users"
#adaugat la user o culoare de profil pentru partea de frontened