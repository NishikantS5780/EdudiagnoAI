from pydantic import BaseModel
from typing import Optional

# --- JobSeeker Schemas ---
class JobSeekerBase(BaseModel):
    firstname: str
    lastname: str
    email: str
    phone: str
    # Add more fields as needed

class JobSeekerCreate(JobSeekerBase):
    password_hash: str

class JobSeekerUpdate(BaseModel):
    firstname: Optional[str]
    lastname: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    # Add more fields as needed

class JobSeekerOut(JobSeekerBase):
    id: int
    class Config:
        orm_mode = True

# --- Job Schemas ---
class JobBase(BaseModel):
    company_id: int
    job_title: Optional[str]
    job_role: Optional[str]
    job_location: Optional[str]
    # Add more fields as needed

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    job_title: Optional[str]
    job_role: Optional[str]
    job_location: Optional[str]
    # Add more fields as needed

class JobOut(JobBase):
    id: int
    class Config:
        orm_mode = True
