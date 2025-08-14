from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base

DATABASE_URL = "postgresql://root:tJ3Yqskhw2RrlQk4UwzstmfnqYQh5Itq@dpg-d2en3peuk2gs73bjn9ig-a.oregon-postgres.render.com/managessm"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base=declarative_base()
