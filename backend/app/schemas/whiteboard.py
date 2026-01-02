from pydantic import BaseModel, Field
from typing import List, Optional

class PointSchema(BaseModel):
    x: float
    y: float

class StrokeSchema(BaseModel):
    points: List[PointSchema]
    color: str
    size: int
    erase: Optional[bool] = None


class WhiteboardCreate(BaseModel):
    name: str

class WhiteboardUpdate(BaseModel):

    sheets: List[List[StrokeSchema]]

class WhiteboardRead(BaseModel):
    id: str
    teacher_id: str
    name: str
    strokes: List[StrokeSchema] = []

    sheets: List[List[StrokeSchema]] = Field(default_factory=lambda: [[]])

    class Config:
        from_attributes = True