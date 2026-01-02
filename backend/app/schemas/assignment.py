from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AssignmentCreate(BaseModel):
    title: str
    description: str
    due_date: str

class SubmissionCreate(BaseModel):
    content_text: Optional[str] = None
    file_data: Optional[str] = None 

class GradeCreate(BaseModel):
    grade: int
    feedback: Optional[str] = ""

class AssignmentOut(BaseModel):
    id: str
    title: str
    description: str
    due_date: datetime
    created_at: datetime

class SubmissionOut(BaseModel):
    id: str
    student_id: str
    student_name: str
    content_text: Optional[str]
    grade: Optional[int]
    feedback: Optional[str]
    submitted_at: datetime