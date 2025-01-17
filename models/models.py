from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True)  
    email = Column(String(100), nullable=False, unique=True)  
    password = Column(String(255), nullable=False)  
    name = Column(String(45), nullable=True)
    role = Column(String(20), nullable=False, default="farmer")  
    country = Column(String(50))  
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    diseases = relationship("Disease", back_populates="user", cascade="all, delete")
    images = relationship("Image", back_populates="user", cascade="all, delete")
    
class Disease(Base):
    __tablename__ = "diseases"
    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(String(255))
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="SET NULL"))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    country = Column(String(50), index=True)
    region = Column(String(50), index=True)
    longitude = Column(String(30))
    latitude = Column(String(30))
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="diseases")
    crop = relationship("Crop", back_populates="diseases")

class Crop(Base):
    __tablename__ = "crops"
    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(255))

    diseases = relationship("Disease", back_populates="crop", cascade="all, delete")

class Image(Base):
    __tablename__ = "images"
    id = Column(String(36), primary_key=True)
    uploaded_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    file_path = Column(String(255), nullable=False) 
    analysis_result = Column(String(255))  
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="SET NULL"))

    user = relationship("User", back_populates="images")
    crop = relationship("Crop")
