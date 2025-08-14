from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models
import schema
from datetime import date

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@app.post("/users")
def create_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(username=user.username, password = user.password, fullname = user.fullname, roll = user.roll, role = user.role, regno = user.regno  )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/classes")
def create_class(class_data: schema.ClassCreate, db:Session = Depends(get_db)):
    db_class = models.Class(name = class_data.name, teacher_id = class_data.teacher_id, marked_by = class_data.marked_by)
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

@app.post("/attendance")
def insert_attendance(att: schema.AttendanceCreate, db:Session = Depends(get_db)):
    students = db.query(models.ClassStudent).filter(models.ClassStudent.class_id == att.class_id).all()
    student_ids = [s.student_id for s in students]
    
    for sid in student_ids:
        status = "absent" if sid in att.absentees else "present"
        db_att = models.Attendance(class_id = att.class_id, marked_by = att.marked_by, date = att.date, is_present = att.is_present)
        db.add(db_att)
    
    db.commit() 
    return {"message": "Attendance inserted successfully"}

@app.get("/students/{student_id}/attendance")
def get_student_attendance(student_id: int, db: Session = Depends(get_db)):
    records = db.query(models.Attendance).filter(models.Attendance.student_id == student_id).all()
    return records

        