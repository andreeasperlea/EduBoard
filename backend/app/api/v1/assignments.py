from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.assignment import Assignment, Submission
from app.models.classroom import Classroom
from app.models.user import User
from app.api.deps import get_current_user
from app.schemas.assignment import AssignmentCreate, AssignmentOut, SubmissionCreate, SubmissionOut, GradeCreate
from typing import Optional
from datetime import datetime

#clasa creata pentru functiile de la assignments: creat assignment, afisat assignments etc
router = APIRouter(tags=["assignments"])

@router.post("/{class_id}", response_model=AssignmentOut)
async def create_assignment(
    class_id: str, 
    req: AssignmentCreate, 
    current_user: User = Depends(get_current_user)
):
    classroom = await Classroom.get(class_id)
    if not classroom or classroom.teacher_id != str(current_user.id):
        raise HTTPException(403, "Not authorized")

    new_assign = Assignment(
        class_id=class_id,
        title=req.title,
        description=req.description,
        due_date=req.due_date
    )
    await new_assign.insert()
    return new_assign

@router.get("/{class_id}", response_model=List[AssignmentOut])
async def list_assignments(class_id: str, current_user: User = Depends(get_current_user)):
    return await Assignment.find(Assignment.class_id == class_id).sort(-Assignment.created_at).to_list()


#functia de submit assigment 
@router.post("/{assignment_id}/submit", response_model=SubmissionOut)
async def submit_assignment(
    assignment_id: str, 
    req: SubmissionCreate, 
    current_user: User = Depends(get_current_user)
):
    assignment = await Assignment.get(assignment_id)
    if not assignment: raise HTTPException(404, "Assignment not found")

    existing = await Submission.find_one(
        Submission.assignment_id == assignment_id,
        Submission.student_id == str(current_user.id)
    )
    if existing:
        existing.content_text = req.content_text
        existing.file_url = req.file_data
        existing.submitted_at = datetime.utcnow() 
        await existing.save()
        return existing

    new_sub = Submission(
        assignment_id=assignment_id,
        student_id=str(current_user.id),
        student_name=current_user.full_name,
        content_text=req.content_text,
        file_url=req.file_data
    )
    await new_sub.insert()
    return new_sub


#fucntie pentru a strange toate submissionurile
@router.get("/{assignment_id}/submissions", response_model=List[SubmissionOut])
async def list_submissions(assignment_id: str, current_user: User = Depends(get_current_user)):
    return await Submission.find(Submission.assignment_id == assignment_id).to_list()

#funcita pentru grading facut de profesor
@router.post("/submissions/{submission_id}/grade")
async def grade_submission(
    submission_id: str, 
    req: GradeCreate,
    current_user: User = Depends(get_current_user)
):
    sub = await Submission.get(submission_id)
    if not sub: raise HTTPException(404, "Submission not found")
    
    sub.grade = req.grade
    sub.feedback = req.feedback
    await sub.save()
    return {"message": "Graded successfully"}

@router.get("/{assignment_id}/my-submission", response_model=Optional[SubmissionOut])
async def get_my_submission(
    assignment_id: str, 
    current_user: User = Depends(get_current_user)
):
    submission = await Submission.find_one(
        Submission.assignment_id == assignment_id,
        Submission.student_id == str(current_user.id)
    )
    return submission 