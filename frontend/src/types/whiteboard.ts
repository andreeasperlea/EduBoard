export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
  color: string;
  size: number;
  erase?: boolean;
}


export interface Whiteboard {
  id: string;
  teacher_id: string;
  name: string;
  strokes: Stroke[];
}
