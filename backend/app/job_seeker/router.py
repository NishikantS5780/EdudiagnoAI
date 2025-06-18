from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database
from app.models import Job, JobSeeker
from app.job_seeker import schemas

router = APIRouter()

# --- JobSeeker APIs ---
@router.post('/jobseeker', response_model=schemas.JobSeekerOut)
def create_jobseeker(jobseeker: schemas.JobSeekerCreate, db: Session = Depends(database.get_db)):
    db_jobseeker = JobSeeker(**jobseeker.dict())
    db.add(db_jobseeker)
    db.commit()
    db.refresh(db_jobseeker)
    return db_jobseeker

@router.get('/jobseeker/{jobseeker_id}', response_model=schemas.JobSeekerOut)
def get_jobseeker(jobseeker_id: int, db: Session = Depends(database.get_db)):
    jobseeker = db.query(JobSeeker).get(jobseeker_id)
    if not jobseeker:
        raise HTTPException(status_code=404, detail='JobSeeker not found')
    return jobseeker

@router.get('/jobseekers', response_model=list[schemas.JobSeekerOut])
def list_jobseekers(db: Session = Depends(database.get_db)):
    return db.query(JobSeeker).all()

@router.put('/jobseeker/{jobseeker_id}', response_model=schemas.JobSeekerOut)
def update_jobseeker(jobseeker_id: int, jobseeker: schemas.JobSeekerUpdate, db: Session = Depends(database.get_db)):
    db_jobseeker = db.query(JobSeeker).get(jobseeker_id)
    if not db_jobseeker:
        raise HTTPException(status_code=404, detail='JobSeeker not found')
    for k, v in jobseeker.dict(exclude_unset=True).items():
        setattr(db_jobseeker, k, v)
    db.commit()
    db.refresh(db_jobseeker)
    return db_jobseeker

@router.delete('/jobseeker/{jobseeker_id}')
def delete_jobseeker(jobseeker_id: int, db: Session = Depends(database.get_db)):
    db_jobseeker = db.query(JobSeeker).get(jobseeker_id)
    if not db_jobseeker:
        raise HTTPException(status_code=404, detail='JobSeeker not found')
    db.delete(db_jobseeker)
    db.commit()
    return {"ok": True}

# --- Job APIs ---
@router.post('/job', response_model=schemas.JobOut)
def create_job(job: schemas.JobCreate, db: Session = Depends(database.get_db)):
    db_job = Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get('/job/{job_id}', response_model=schemas.JobOut)
def get_job(job_id: int, db: Session = Depends(database.get_db)):
    job = db.query(Job).get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail='Job not found')
    return job

@router.get('/jobs', response_model=list[schemas.JobOut])
def list_jobs(db: Session = Depends(database.get_db)):
    return db.query(Job).all()

@router.put('/job/{job_id}', response_model=schemas.JobOut)
def update_job(job_id: int, job: schemas.JobUpdate, db: Session = Depends(database.get_db)):
    db_job = db.query(Job).get(job_id)
    if not db_job:
        raise HTTPException(status_code=404, detail='Job not found')
    for k, v in job.dict(exclude_unset=True).items():
        setattr(db_job, k, v)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete('/job/{job_id}')
def delete_job(job_id: int, db: Session = Depends(database.get_db)):
    db_job = db.query(Job).get(job_id)
    if not db_job:
        raise HTTPException(status_code=404, detail='Job not found')
    db.delete(db_job)
    db.commit()
    return {"ok": True}