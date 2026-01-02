from beanie import Document
from pydantic import BaseModel
from typing import List, Optional


#schimbat putin clasa pentru whiteboard, pentru a permite sa avem intr un whiteboard mai multe foi de desenat 
class Point(BaseModel):
    x: float
    y: float

class Stroke(BaseModel):
    points: List[Point]
    color: str
    size: int
    erase: Optional[bool] = None

class Whiteboard(Document):
    teacher_id: str
    name: str
    strokes: List[Stroke] = []
    sheets: List[List[Stroke]] = [] #astfel sheets retine o lista de whiteboard, adica o list de liste de stroke uri

    class Settings:
        name = "whiteboards"
