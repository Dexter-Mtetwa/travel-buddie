from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class TripRequestDB(Base):
    __tablename__ = "trip_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_query = Column(String)
    origin = Column(String, nullable=True)
    destination = Column(String, nullable=True)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    travelers = Column(Integer, nullable=True)
    budget = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    recommendations = relationship("RecommendationDB", back_populates="trip_request")

class RecommendationDB(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    trip_request_id = Column(Integer, ForeignKey("trip_requests.id"))
    flight_airline = Column(String)
    flight_price = Column(Float)
    hotel_name = Column(String)
    hotel_price = Column(Float)
    car_company = Column(String, nullable=True)
    car_type = Column(String, nullable=True)
    car_price = Column(Float, nullable=True)
    total_price = Column(Float)
    score = Column(Float)
    reasoning = Column(String)
    
    trip_request = relationship("TripRequestDB", back_populates="recommendations")
