from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List
from app.models.classroom import Classroom
from app.schemas.classroom import ClassroomCreate, ClassroomOut
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.api.deps import get_current_user
from app.schemas.user import UserRead
from app.models.whiteboard import Whiteboard

router = APIRouter(tags=["classes"])

@router.post("", response_model=ClassroomOut)
async def create_class(
    class_in: ClassroomCreate,
    current_user = Depends(get_current_user)
):
    
    new_board = Whiteboard(
        teacher_id=str(current_user.id),
        name=f"Board: {class_in.name}",
        strokes=[]
    )
    await new_board.insert()


    new_class = Classroom(
        name=class_in.name,
        description=class_in.description,
        teacher_id=str(current_user.id),
        student_ids=[],
        whiteboard_id=str(new_board.id)
    )
    await new_class.insert()
    
   
    return ClassroomOut(id=str(new_class.id), **new_class.dict(exclude={"id"}))

@router.get("", response_model=List[ClassroomOut])
async def read_classes(current_user = Depends(get_current_user)):
    print(f"[DEBUG] User curent: {current_user.email}, Rol: {current_user.role}, ID: {current_user.id}")
    if current_user.role == UserRole.TEACHER:
        print("[DEBUG] Este profesor. Caut clasele create de el.")
        classes = await Classroom.find(Classroom.teacher_id == str(current_user.id)).to_list()
    else:
        print(f"[DEBUG] Este student. Caut ID-ul {str(current_user.id)} in listele de elevi.")
        classes = await Classroom.find(
            {"student_ids": str(current_user.id)}
        ).to_list()

    print(f"[DEBUG] Clase găsite: {len(classes)}")    
    return [ClassroomOut(id=str(c.id), **c.dict(exclude={"id"})) for c in classes]

@router.get("/{class_id}", response_model=ClassroomOut)
async def read_class_details(class_id: str, current_user = Depends(get_current_user)):
    classroom = await Classroom.get(class_id)
    if not classroom:
        raise HTTPException(status_code=404, detail="Class not found")
 
    return ClassroomOut(id=str(classroom.id), **classroom.dict(exclude={"id"}))

@router.post("/{class_id}/invite")
async def invite_student(
    class_id: str, 
    email: str = Body(..., embed=True),
    current_user = Depends(get_current_user)
): 
    classroom = await Classroom.get(class_id)
    if not classroom or classroom.teacher_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Class not found or access denied")

    student = await User.find_one(User.email == email)
    if not student:
        raise HTTPException(status_code=404, detail="User with this email not found")
    
    if str(student.id) in classroom.student_ids:
        raise HTTPException(status_code=400, detail="Student already in class")

    
    classroom.student_ids.append(str(student.id))
    await classroom.save()

    return {"message": "Student added successfully", "student_name": student.full_name}

@router.get("/{class_id}/students", response_model=List[UserRead])
async def get_class_students(class_id: str, current_user = Depends(get_current_user)):
    classroom = await Classroom.get(class_id)
    if not classroom:
        raise HTTPException(status_code=404, detail="Class not found")

    if not classroom.student_ids:
        return []

    try:
  
        object_ids = [PydanticObjectId(sid) for sid in classroom.student_ids]
        
        students = await User.find({"_id": {"$in": object_ids}}).to_list()
        
    except Exception as e:
        print(f"CRITICAL ERROR in get_students: {e}")
        return []
    
    results = []
    for s in students:
        d = s.dict()
        d['id'] = str(s.id)
        results.append(UserRead(**d))
        
    return results