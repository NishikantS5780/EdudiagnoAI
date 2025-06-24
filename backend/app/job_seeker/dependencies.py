from fastapi import Request, Depends
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.config import settings
from app.models import JobSeeker
from app.lib.errors import CustomException
from sqlalchemy import select
from app import database

def authorize_jobseeker(request: Request, db: Session = Depends(database.get_db)):
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise CustomException('Missing or invalid Authorization header', code=401)
    token = auth_header.split("Bearer ", 1)[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        jobseeker_id = int(payload.get("sub"))
    except (JWTError, ValueError, TypeError):
        raise CustomException('Invalid token', code=401)
    if not jobseeker_id:
        raise CustomException('Invalid token payload', code=401)
    stmt = select(JobSeeker).where(JobSeeker.id == jobseeker_id)
    jobseeker = db.scalars(stmt).first()
    if not jobseeker:
        raise CustomException('JobSeeker not found', code=404)
    return jobseeker
