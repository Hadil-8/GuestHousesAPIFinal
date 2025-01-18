import sqlite3
import pandas as pd
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine, text

# Use the updated `declarative_base` from SQLAlchemy 2.0
Base = declarative_base()

# SQLite database URL
DATABASE_URL = "sqlite:///./GHsys.db"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Ensure CSV files exist and are not empty
def validate_csv(file_path):
    try:
        data = pd.read_csv(file_path)
        if data.empty:
            raise ValueError(f"{file_path} is empty.")
        return data
    except FileNotFoundError:
        raise FileNotFoundError(f"{file_path} not found. Please ensure the file exists.")
    except ValueError as e:
        raise ValueError(f"Error reading {file_path}: {e}")

# Validate and load data from CSV files
try:
    activities_df = validate_csv("Activities.csv")
    guesthouses_df = validate_csv("GuestHouses.csv")
except (FileNotFoundError, ValueError) as e:
    print(e)
    raise SystemExit

# Create the SQLite tables using SQLAlchemy
Base.metadata.create_all(bind=engine)

# Insert data into Activities and GuestHouses
with engine.connect() as conn:
    activities_df.to_sql("Activities", con=conn, if_exists="replace", index=False)
    guesthouses_df.to_sql("GuestHouses", con=conn, if_exists="replace", index=False)

print("Data successfully inserted into the database.")

# Query and print data using SQLAlchemy
session = SessionLocal()

try:
    # Fetch data from the Activities table using `text()` to wrap the SQL query
    activities_data = session.execute(text("SELECT * FROM Activities")).fetchall()
    print("\nActivities Data:")
    for row in activities_data:
        print(row)

    # Fetch data from the GuestHouses table using `text()` to wrap the SQL query
    guesthouses_data = session.execute(text("SELECT * FROM GuestHouses")).fetchall()
    print("\nGuestHouses Data:")
    for row in guesthouses_data:
        print(row)
finally:
    # Close the session
    session.close()

print("Database operations completed successfully.")
