from pydantic import BaseModel

# Pydantic model for GuestHouse
class GuestHouse(BaseModel):
    GuestHouse_id: str
    Name: str
    Region: str
    City: str
    Address: str
    Description: str
    Phone: str
    EcoCertification: bool
    PricePerNight: int

    class Config:
        from_attributes = True  # This allows SQLAlchemy models to be used with Pydantic models

# Pydantic model for Activity
class Activity(BaseModel):
    Activity_id: str
    Name: str
    Description: str
    Type: str
    Region: str
    City: str
    Price: int

    class Config:
      from_attributes  = True  # This allows SQLAlchemy models to be used with Pydantic models
