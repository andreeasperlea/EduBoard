from pydantic import BaseModel
from typing import List

class PointSchema(BaseModel):
    x: float
    y: float

class StrokeSchema(BaseModel):
    points: List[PointSchema]
    color: str
    size: int
    erase: bool | None = None


class WhiteboardRead(BaseModel):
    id: str
    teacher_id: str
    name: str
    strokes: List[StrokeSchema] = []

    class Config:
        from_attributes = True

class WhiteboardCreate(BaseModel):
    name: str
