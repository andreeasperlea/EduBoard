from fastapi import APIRouter, Depends, HTTPException
from app.models.whiteboard import Whiteboard
from app.models import User
from app.api.deps import get_current_user

router = APIRouter(tags=["Whiteboard"])

@router.get("/")
async def list_whiteboards(current_user: User = Depends(get_current_user)):
    boards = await Whiteboard.find(
        Whiteboard.teacher_id == str(current_user.id)
    ).to_list()
    
    return [
        {
            "id": str(b.id),
            "teacher_id": b.teacher_id,
            "name": b.name,
          
        }
        for b in boards
    ]

@router.post("/")
async def create_whiteboard(payload: dict, current_user: User = Depends(get_current_user)):
    name = payload.get("name")
    if not name or not name.strip():
        raise HTTPException(400, "Name cannot be empty")

    board = Whiteboard(
        teacher_id=str(current_user.id),
        name=name,
        sheets=[[]] 
    )
    await board.insert()

    return {"id": str(board.id), "name": board.name}

@router.get("/{board_id}")
async def get_whiteboard(board_id: str, current_user: User = Depends(get_current_user)):
    board = await Whiteboard.get(board_id)
    if not board:
        raise HTTPException(404, "Not found")

    if not board.sheets and board.strokes:
        board.sheets = [board.strokes]
    elif not board.sheets:
        board.sheets = [[]]

    return {
        "id": str(board.id),
        "teacher_id": board.teacher_id,
        "name": board.name,
        "sheets": board.sheets
    }

@router.post("/{board_id}/save")
async def save_whiteboard(
    board_id: str,
    data: dict,
    current_user: User = Depends(get_current_user)
):
    board = await Whiteboard.get(board_id)
    if not board:
        raise HTTPException(404, "Not found")
    if "sheets" in data:
        board.sheets = data["sheets"]
        board.strokes = [] 
        await board.save()
        
    return {"status": "saved"}

@router.delete("/{board_id}")
async def delete_whiteboard(board_id: str, current_user: User = Depends(get_current_user)):
    board = await Whiteboard.get(board_id)
    if not board: 
        raise HTTPException(404, "Whiteboard not found")
    await board.delete()
    return {"status": "deleted"}