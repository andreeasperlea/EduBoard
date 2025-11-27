from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models import User, UserRole
from app.schemas.user import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/", response_model=DashboardResponse)
async def dashboard(current_user: User = Depends(get_current_user)):

    if current_user.role == UserRole.STUDENT:
        return DashboardResponse(
            message=f"Welcome student {current_user.full_name}!",
            role=current_user.role,
            data={
                "courses": [],
                "assignments": [],
                "notifications": [],
            }
        )

    if current_user.role == UserRole.TEACHER:
        return DashboardResponse(
            message=f"Welcome teacher {current_user.full_name}!",
            role=current_user.role,
            data={
                "classes_managed": [],
                "students": [],
                "tasks_to_review": [],
            }
        )

    raise HTTPException(500, "Invalid user role")
