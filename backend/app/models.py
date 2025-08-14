from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import date

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    fullname = Column(String, nullable=False)
    roll = Column(Integer, nullable=True)
    role = Column(String, nullable=False)  # 'teacher' or 'student'
    regno = Column(String, nullable=False)

    classes = relationship("Class", back_populates="teacher")  # for teachers
    student_classes = relationship("ClassStudent", back_populates="student")  # for students
    attendance = relationship("Attendance", back_populates="student")
    marker = relationship("marker", back_populates="marked_id")


class Class(Base):
    __tablename__ = 'classes'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    marked_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    
    teacher = relationship("User", back_populates="classes")
    students = relationship("ClassStudent", back_populates="class_") 
    attendance = relationship("Attendance", back_populates="class_")
    marked_id = relationship("User", back_populates="marker")


class ClassStudent(Base):
    __tablename__ = 'class_students'
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint('class_id', 'student_id', name='class_student_constr'),
    )

    
    class_ = relationship("Class", back_populates="students")  
    student = relationship("User", back_populates="student_classes")


class Attendance(Base):
    __tablename__ = 'attendance'
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, default=date.today, nullable=False)
    is_present = Column(Boolean, default=True)

    __table_args__ = (
        UniqueConstraint('class_id', 'student_id', 'date', name='attendance_constr'),
    )


    class_ = relationship("Class", back_populates="attendance")
    student = relationship("User", back_populates="attendance")
