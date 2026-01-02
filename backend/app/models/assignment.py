import uuid
from beanie import Document
from typing import List, Optional
from pydantic import Field
from datetime import datetime



#clasele Assignment si Submission pentru partea de assigmnet care este curpisna in clase
class Assignment(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    class_id: str
    title: str
    description: str
    due_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "assignments"

class Submission(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assignment_id: str
    student_id: str
    student_name: str 
    
    content_text: Optional[str] = None
    file_url: Optional[str] = None 
    
    grade: Optional[int] = None 
    feedback: Optional[str] = None
    
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "submissions"