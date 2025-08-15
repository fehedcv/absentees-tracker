from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class UserCreate(BaseModel):
    username: str
    password: str
    role: str
    fullname: str
    regno: str


class ClassCreate(BaseModel):
    name: str
    teacher_id: int
    


class AttendanceCreate(BaseModel):
    class_id: int
    date: date
    absentees: List[int]  # List of student IDs
    marked_by: int

class ClassStudentCreate(BaseModel):
    class_id: int
    student_id: int
    roll_number: int

class UserOut(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True
