from pydantic import BaseModel
from typing import Optional, List

class ClassroomCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ClassroomOut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    teacher_id: str
    whiteboard_id: Optional[str] = None