from sqlalchemy import Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True)
    email = Column(String(50), nullable=False)
    password = Column(String(36), nullable=False)
    role = Column(String(20))
    country = Column(String(20))

    disease = relationship('Disease', back_populates='user')

class Disease(Base):
    __tablename__ = "diseases"
    id = Column(String(36), primary_key=True)
    name = Column(String(60), nullable=False, index=True)
    country = Column(String(36), index=True)
    region = Column(String(36), index=True)
    longitude = Column(String(30))
    latitude = Column(String(30))

    user_id = Column(String(36), foreignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    user = relationship('User', back_populates='disease')
    
