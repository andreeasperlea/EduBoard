from fastapi import APIRouter, Depends, HTTPException
from app.models.whiteboard import Whiteboard
from app.models import User, UserRole
from app.api.deps import get_current_user
from app.schemas.whiteboard import WhiteboardRead, WhiteboardCreate

router = APIRouter(prefix="/whiteboard", tags=["Whiteboard"])


# --------------------
# LIST WHITEBOARDS
# --------------------
@router.get("/")
async def list_whiteboards(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.TEACHER:
        raise HTTPException(403, "Only teachers can view whiteboards")

    boards = await Whiteboard.find(
        Whiteboard.teacher_id == str(current_user.id)
    ).to_list()

    return [
        {
            "id": str(b.id),
            "teacher_id": b.teacher_id,
            "name": b.name,
            "strokes": b.strokes
        }
        for b in boards
    ]



# --------------------
# CREATE WHITEBOARD
# --------------------
@router.post("/", response_model=WhiteboardRead)
async def create_whiteboard(payload: WhiteboardCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.TEACHER:
        raise HTTPException(403, "Only teachers can create whiteboards")

    if not payload.name.strip():
        raise HTTPException(400, "Whiteboard name cannot be empty")

    board = Whiteboard(
        teacher_id=str(current_user.id),
        name=payload.name,
        strokes=[]
    )
    await board.insert()

    return {
        "id": str(board.id),
        "teacher_id": board.teacher_id,
        "name": board.name,
        "strokes": board.strokes
    }



# --------------------
# GET ONE WHITEBOARD
# --------------------
@router.get("/{board_id}", response_model=WhiteboardRead)
async def get_whiteboard(board_id: str, current_user: User = Depends(get_current_user)):
    board = await Whiteboard.get(board_id)
    if not board or board.teacher_id != str(current_user.id):
        raise HTTPException(404, "Not found")

    return {
        "id": str(board.id),
        "teacher_id": board.teacher_id,
        "name": board.name,
        "strokes": board.strokes
    }


# --------------------
# SAVE WHITEBOARD
# --------------------
@router.post("/{board_id}/save")
async def save_whiteboard(
    board_id: str,
    data: dict,
    current_user: User = Depends(get_current_user)
):
    board = await Whiteboard.get(board_id)

    if not board or board.teacher_id != str(current_user.id):
        raise HTTPException(404, "Not found")

    board.strokes = data["strokes"]
    await board.save()

    return {"status": "saved"}

@router.delete("/{board_id}")
async def delete_whiteboard(board_id: str, current_user: User = Depends(get_current_user)):
    board = await Whiteboard.get(board_id)

    if not board or board.teacher_id != str(current_user.id):
        raise HTTPException(404, "Whiteboard not found")

    await board.delete()
    return {"status": "deleted"}
