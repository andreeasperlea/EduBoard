from beanie import Document
from pydantic import BaseModel
from typing import List

class Point(BaseModel):
    x: float
    y: float

class Stroke(BaseModel):
    points: List[Point]
    color: str
    size: int
    erase: bool | None = None


class Whiteboard(Document):
    teacher_id: str
    name: str
    strokes: List[Stroke] = []

    class Settings:
        name = "whiteboards"
