from pydantic import BaseModel
from typing import List 
from datetime import datetime

class CheckInRequest(BaseModel):
    code: str

class AttendanceSessionOut(BaseModel):
    id: str
    class_id: str
    code: str
    is_active: bool
    created_at: datetime
    present_student_ids: List[str]
    present_count: int

    class Config: 
        from_attributes = True

