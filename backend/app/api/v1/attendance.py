import random
from fastapi import APIRouter, Depends, HTTPException
from app.models.attendance import AttendanceSession
from app.models.classroom import Classroom
from app.models.user import User
from app.api.deps import get_current_user
from app.schemas.attendance import AttendanceSessionOut, CheckInRequest
from fastapi.responses import StreamingResponse
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from beanie import PydanticObjectId 

router = APIRouter(tags=["attendance"])

def generate_code():
    return str(random.randint(1000, 9999))

#backend pentru functionalitatea de a face prezenta 


#in primul rand, daor profesorul poate face prezenta, se enereaza un cod si se inchid oricare alte sesiuni de prezenta
@router.post("/{class_id}/start", response_model=AttendanceSessionOut)
async def start_attendance(class_id: str, current_user: User = Depends(get_current_user)):
  
    classroom = await Classroom.get(class_id)
    if not classroom:
        raise HTTPException(404, "Class not found")
    

    if classroom.teacher_id != str(current_user.id):
        raise HTTPException(403, "Only teacher can start attendance")

    active_sessions = await AttendanceSession.find(
        AttendanceSession.class_id == class_id,
        AttendanceSession.is_active == True
    ).to_list()
    
    for s in active_sessions:
        s.is_active = False
        await s.save()

    new_session = AttendanceSession(
        class_id=class_id,
        code=generate_code(),
        is_active=True,
        present_student_ids=[]
    )
    await new_session.insert()

    return AttendanceSessionOut(
        **new_session.dict(), 
        present_count=0
    )


#profesorul poate opri prezenta oricand doreste acesta
@router.post("/{class_id}/stop")
async def stop_attendance(class_id: str, current_user: User = Depends(get_current_user)):
    classroom = await Classroom.get(class_id)
    if not classroom: raise HTTPException(404, "Class not found")
    
    if classroom.teacher_id != str(current_user.id): 
        raise HTTPException(403, "Not authorized")

    active_sessions = await AttendanceSession.find(
        AttendanceSession.class_id == class_id,
        AttendanceSession.is_active == True
    ).to_list()

    for s in active_sessions:
        s.is_active = False
        await s.save()
    
    return {"message": "Attendance stopped"}

@router.get("/{class_id}/active", response_model=AttendanceSessionOut)
async def get_active_session(class_id: str, current_user: User = Depends(get_current_user)):
    session = await AttendanceSession.find_one(
        AttendanceSession.class_id == class_id,
        AttendanceSession.is_active == True
    )
    
    if not session:
       
        raise HTTPException(404, "No active attendance session")

    return AttendanceSessionOut(
        **session.dict(),
        present_count=len(session.present_student_ids)
    )


#checkin facut de catre elevi  care verifica daca codul trimis de catre acestia se potriveste cu cel al sesiunii
@router.post("/{class_id}/checkin")
async def check_in(class_id: str, req: CheckInRequest, current_user: User = Depends(get_current_user)):
    session = await AttendanceSession.find_one(
        AttendanceSession.class_id == class_id,
        AttendanceSession.is_active == True
    )
    
    if not session:
        raise HTTPException(400, "No active attendance session")

    if req.code != session.code:
        raise HTTPException(400, "Invalid Code")

    uid = str(current_user.id)
    if uid not in session.present_student_ids:
        session.present_student_ids.append(uid)
        await session.save()
        return {"message": "Checked in!", "status": "present"}
    
    return {"message": "Already checked in.", "status": "present"}


#fucntie pentru a genera un raport de preznta aferent unei clase si care ofera informatii in privinta intregii prezente
@router.get("/{class_id}/export")
async def export_attendance_pdf(class_id: str, current_user: User = Depends(get_current_user)):
    classroom = await Classroom.get(class_id)
    if not classroom: raise HTTPException(404, "Class not found")
    if classroom.teacher_id != str(current_user.id): raise HTTPException(403, "Only teacher can export")


    students = await User.find({"_id": {"$in": [PydanticObjectId(sid) for sid in classroom.student_ids]}}).to_list()
    sessions = await AttendanceSession.find(AttendanceSession.class_id == class_id).to_list()
    total_sessions = len(sessions)

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, f"Attendance Report: {classroom.name}")
    p.setFont("Helvetica", 10)
    p.drawString(50, height - 70, f"Total Sessions: {total_sessions}")

    y = height - 100
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y, "Student Name")
    p.drawString(300, y, "Present")
    p.drawString(400, y, "Absent")
    p.drawString(500, y, "Rate %")
    
    p.line(50, y - 5, 550, y - 5)
    y -= 25

    p.setFont("Helvetica", 12)
    for student in students:
        sid = str(student.id)
        present_count = 0
        for s in sessions:
            if sid in s.present_student_ids:
                present_count += 1
        
        absent_count = total_sessions - present_count
        rate = (present_count / total_sessions * 100) if total_sessions > 0 else 0

        p.drawString(50, y, student.full_name)
        p.drawString(300, y, str(present_count))
        p.drawString(400, y, str(absent_count))
        
        if rate < 50: p.setFillColorRGB(1, 0, 0)
        else: p.setFillColorRGB(0, 0, 0)
        
        p.drawString(500, y, f"{rate:.1f}%")
        p.setFillColorRGB(0, 0, 0) 

        y -= 20
        
        if y < 50:
            p.showPage()
            y = height - 50

    p.save()
    buffer.seek(0)

    return StreamingResponse(
        buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename=Attendance_{class_id}.pdf"}
    )