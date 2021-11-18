from sqlalchemy import Boolean, Column, Integer, String

from database import Base

class Restaurant(Base):
    __tablename__ = 'restaurants'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    food_type = Column(String)
    qualification = Column(Integer, default=None)
    visited = Column(Boolean, default=False)