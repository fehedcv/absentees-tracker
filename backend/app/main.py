from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import engine, SessionLocal
import models.models as models
import schemas.schema as schema
from datetime import date
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@app.post("/users")
def create_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(username=user.username, password = user.password, fullname = user.fullname, role = user.role, regno = user.regno  )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/classes")
def create_class(class_data: schema.ClassCreate, db:Session = Depends(get_db)):
    db_class = models.Class(name = class_data.name, teacher_id = class_data.teacher_id)
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

@app.post("/attendance")
def insert_attendance(att: schema.AttendanceCreate, db: Session = Depends(get_db)):
    # Get students of the class
    students = db.query(models.ClassStudent).filter(
        models.ClassStudent.class_id == att.class_id
    ).all()

    # Map roll_number -> student_id
    roll_to_id = {s.roll_number: s.student_id for s in students}

    for roll_number, student_id in roll_to_id.items():
        status = "absent" if roll_number in att.absentees else "present"
        db_att = models.Attendance(
            class_id=att.class_id,
            marked_by=att.marked_by,
            date=att.date,
            is_present=status,
            student_id=student_id
        )
        db.add(db_att)

    db.commit()
    return {"message": "Attendance inserted successfully"}


@app.post("/class_student")
def insert_class_student(class_student: schema.ClassStudentCreate, db:Session = Depends(get_db)):
    db_std = models.ClassStudent(class_id = class_student.class_id, student_id = class_student.student_id, roll_number = class_student.roll_number)
    db.add(db_std)
    db.commit()
    return{"message": "Added succesfully"}

@app.get("/students/{student_id}/attendance")
def get_student_attendance(student_id: int, db: Session = Depends(get_db)):
    records = db.query(models.Attendance).filter(models.Attendance.student_id == student_id).all()
    return records

@app.get("/classes")
def get_classes(db: Session = Depends(get_db)):
    classes = db.query(models.Class).all()
    return [{"id": c.id, "name": c.name} for c in classes]

@app.get("/classes/{class_id}/students")
def get_students(class_id: int, db: Session = Depends(get_db)) -> List[Dict]:
    stmt = (
        select(models.ClassStudent.roll_number, models.User.fullname)
        .join(models.User, models.ClassStudent.student_id == models.User.id)
        .where(models.ClassStudent.class_id == class_id, models.User.role == "student")
    )
    result = db.execute(stmt).all()
    if not result:
        raise HTTPException(status_code=404, detail="No students found for this class")
    
    return [{"roll_number": r[0], "name": r[1]} for r in result]

@app.get("/attendance/{student_id}")
def get_attendance(
    student_id: int,
    start: date,
    end: date,
    db: Session = Depends(get_db)
):
    records = db.query(models.Attendance).filter(
        models.Attendance.student_id == student_id,
        models.Attendance.date >= start,
        models.Attendance.date <= end
    ).all()

    return [
        {
            "date": record.date.strftime("%Y-%m-%d"),
            "status": record.is_present  # assuming already "present"/"absent"
        }
        for record in records
    ]