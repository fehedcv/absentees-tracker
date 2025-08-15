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
    role = Column(String, nullable=False)  # 'teacher' or 'student'
    regno = Column(String, nullable=False)

    # Classes where this user is the teacher
    classes = relationship(
        "Class",
        back_populates="teacher",
        foreign_keys="Class.teacher_id"
    )

    # Classes where this user is a student
    student_classes = relationship(
        "ClassStudent",
        back_populates="student"
    )

    # Attendance records where this user is the student
    attendance = relationship(
        "Attendance",
        back_populates="student",
        foreign_keys="[Attendance.student_id]"
    )

    # Attendance records marked by this user (teacher or student leader)
    marked_attendance = relationship(
        "Attendance",
        back_populates="marked_id",
        foreign_keys="[Attendance.marked_by]"
    )


class Class(Base):
    __tablename__ = 'classes'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Teacher of the class
    teacher = relationship(
        "User",
        back_populates="classes",
        foreign_keys=[teacher_id]
    )

    # Students in this class
    students = relationship(
        "ClassStudent",
        back_populates="class_"
    )

    # Attendance records for this class
    attendance = relationship(
        "Attendance",
        back_populates="class_"
    )


class ClassStudent(Base):
    __tablename__ = 'class_students'

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    roll_number = Column(Integer, nullable=True)
    __table_args__ = (
        UniqueConstraint('class_id', 'student_id', name='class_student_constr'),
    )

    # Relationships
    class_ = relationship(
        "Class",
        back_populates="students"
    )
    student = relationship(
        "User",
        back_populates="student_classes"
    )


class Attendance(Base):
    __tablename__ = 'attendance'

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    marked_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, default=date.today, nullable=False)
    is_present = Column(String)

    __table_args__ = (
        UniqueConstraint('class_id', 'student_id', 'date', name='attendance_constr'),
    )

    # Relationships
    class_ = relationship(
        "Class",
        back_populates="attendance"
    )
    student = relationship(
        "User",
        back_populates="attendance",
        foreign_keys=[student_id]
    )
    marked_id = relationship(
        "User",
        back_populates="marked_attendance",
        foreign_keys=[marked_by]
    )
