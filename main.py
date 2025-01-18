from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv
import os
from models import Base, GuestHouses, Activities
from database import engine, SessionLocal
from schemas import GuestHouse, Activity
from passlib.context import CryptContext



# Load environment variables
load_dotenv()

# Retrieve environment variables with fallback to default values if not set
SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))


# Print for testing
print("SECRET_KEY:", SECRET_KEY)
print("ALGORITHM:", ALGORITHM)
print("ACCESS_TOKEN_EXPIRE_MINUTES:", ACCESS_TOKEN_EXPIRE_MINUTES)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)


app = FastAPI()

# CORS middleware setup
origins = [
    "http://localhost:3000",  # Your frontend URL
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 security scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Password hashing utilities
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Fake users database (use hashed passwords)
fake_users_db = {
    "testuser": {
        "username": "testuser",
        "password": "$2b$12$Xk5ttcTIEctgTt8uANhIvuM56e4.hmdPYdYe1EV9Jvuo35op2yP0C",  # Hashed 'password'
    }
}

# Models for authentication (Pydantic models)
class User(BaseModel):
    username: str

class UserInDB(User):
    hashed_password: str



# Utility to verify passwords
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)


# Utility to create a JWT access token
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


# Dependency to get the current authenticated user
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = User(username=username)
    except JWTError:
        raise credentials_exception
    return token_data


# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication endpoint to get a token
@app.post("/token/")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    stored_username = "testuser"
    stored_password_hash = "$2b$12$W1DBvzcp3jQvat6sKHLIE.2jC5rNTLeWFq450h701zB.CyMNjvdMS"
    if form_data.username != stored_username or not verify_password(form_data.password, stored_password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": form_data.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

# Protected route example
@app.get("/protected/")
async def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": "Access granted", "user": current_user}

# GuestHouse endpoints
from fastapi import Query

@app.get("/GuestHouses/", response_model=List[GuestHouse])
async def get_all_guesthouses(
    Region: str = Query(None), 
    PricePerNight_min: float = Query(None), 
    PricePerNight_max: float = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(GuestHouses)
    
    if Region:
        query = query.filter(GuestHouses.Region == Region)
    if PricePerNight_min is not None:
        query = query.filter(GuestHouses.PricePerNight_min >= PricePerNight_min)
    if PricePerNight_max is not None:
        query = query.filter(GuestHouses.PricePerNight_max <= PricePerNight_max)
    
    return query.all()


@app.get("/GuestHouses/{GuestHouse_id}", response_model=GuestHouse)
async def get_guesthouse(GuestHouse_id: str, db: Session = Depends(get_db)):
    guesthouse = db.query(GuestHouses).filter(GuestHouses.GuestHouse_id == GuestHouse_id).first()
    if not guesthouse:
        raise HTTPException(status_code=404, detail="Guesthouse not found")
    return guesthouse

@app.post("/GuestHouses/", response_model=GuestHouse)
def create_guesthouse(
    guesthouse: GuestHouse, 
    db: Session = Depends(get_db), 
    current_user: str = Depends(get_current_user)
):
    existing_gh = db.query(GuestHouses).filter(GuestHouses.GuestHouse_id == guesthouse.GuestHouse_id).first()
    if existing_gh:
        raise HTTPException(status_code=400, detail="GuestHouse with this ID already exists")
    new_guesthouse = GuestHouses(**guesthouse.dict())
    db.add(new_guesthouse)
    db.commit()
    db.refresh(new_guesthouse)
    return new_guesthouse

@app.put("/GuestHouses/{GuestHouse_id}", response_model=GuestHouse)
async def update_guesthouse(GuestHouse_id: str, guest_house: GuestHouse, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    existing_guest_house = db.query(GuestHouses).filter(GuestHouses.GuestHouse_id == GuestHouse_id).first()
    if not existing_guest_house:
        raise HTTPException(status_code=404, detail="GuestHouse not found")
    for key, value in guest_house.dict(exclude_unset=True).items():
        setattr(existing_guest_house, key, value)
    db.commit()
    db.refresh(existing_guest_house)
    return existing_guest_house

# Activity endpoints
@app.get("/Activities/", response_model=List[Activity])
async def get_all_activities(db: Session = Depends(get_db)):
    return db.query(Activities).all()


@app.get("/Activities/{Activity_id}", response_model=Activity)
async def get_activity(Activity_id: str, db: Session = Depends(get_db)):
    activity = db.query(Activities).filter(Activities.Activity_id == Activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity

@app.post("/Activities/", response_model=Activity)
async def create_activity(activity: Activity, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    existing_activity = db.query(Activities).filter(Activities.Activity_id == activity.Activity_id).first()
    if existing_activity:
        raise HTTPException(status_code=400, detail="Activity with this ID already exists")
    new_activity = Activities(**activity.dict())
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    return new_activity

@app.put("/Activities/{Activity_id}", response_model=Activity)
async def update_activity(Activity_id: str, activity: Activity, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    existing_activity = db.query(Activities).filter(Activities.Activity_id == Activity_id).first()
    if not existing_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    for key, value in activity.dict(exclude_unset=True).items():
        setattr(existing_activity, key, value)
    db.commit()
    db.refresh(existing_activity)
    return existing_activity


@app.delete("/Activities/{Activity_id}", response_model=dict)
async def delete_activity(Activity_id: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    """
    Deletes an activity by its ID. Requires user authentication.
    """
    # Query the database for the activity
    activity = db.query(Activities).filter(Activities.Activity_id == Activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    # Delete the activity from the database
    db.delete(activity)
    db.commit()
    
    return {"message": f"Activity with ID {Activity_id} has been deleted successfully"}


@app.delete("/GuestHouses/{GuestHouse_id}", response_model=dict)
async def delete_guesthouse(GuestHouse_id: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    """
    Deletes a guesthouse by its ID. Requires user authentication.
    """
    # Query the database for the guesthouse
    guesthouse = db.query(GuestHouses).filter(GuestHouses.GuestHouse_id == GuestHouse_id).first()
    
    if not guesthouse:
        raise HTTPException(status_code=404, detail="Guesthouse not found")
    
    # Delete the guesthouse from the database
    db.delete(guesthouse)
    db.commit()
    
    return {"message": f"Guesthouse with ID {GuestHouse_id} has been deleted successfully"}



@app.get("/")
async def root():
    return {"message": "Welcome to the Guesthouses API. Check SWAGGER at http://localhost:8000/docs"}