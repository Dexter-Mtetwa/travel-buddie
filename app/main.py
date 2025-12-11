from fastapi import FastAPI
from app.routers import chat
from dotenv import load_dotenv
from app.database import engine, Base
import os

# Load environment variables from .env file
load_dotenv(dotenv_path="app/.env")

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Travel Buddie API"}
