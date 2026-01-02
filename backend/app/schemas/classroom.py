
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class AnnouncementOut(BaseModel):
    id: str
    content: str
    author_name: str
    posted_at: datetime

class ResourceOut(BaseModel):
    id: str
    title: str
    url: str
    type: str
    created_at: datetime

class ClassroomOut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    teacher_id: str
    whiteboard_id: Optional[str] = None
    student_ids: List[str] = []
    
    announcements: List[AnnouncementOut] = []
    resources: List[ResourceOut] = []

    class Config:
        from_attributes = True

class ClassroomCreate(BaseModel):
    name: str
    description: Optional[str] = None

class AnnouncementCreate(BaseModel):
    content: str

class ResourceCreate(BaseModel):
    title: str
    type: str = "link"       
    url: Optional[str] = None 
    fileData: Optional[str] = None 