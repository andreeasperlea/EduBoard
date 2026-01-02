from beanie import Document
from typing import List
from pydantic import Field
from datetime import datetime
import uuid


class AttendanceSession(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

    class_id: str
    code: str
    is_active: bool = True
    created_at: datetime = Field(default_factory= datetime.utcnow)

    present_student_ids: List[str] = []

    class Settings: 
        name = "attendance_sessions"
