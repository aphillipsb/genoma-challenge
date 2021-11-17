from typing import Optional
from pydantic import BaseModel

class RestaurantBase(BaseModel):
    name: str
    location: str
    food_type: str
    qualification: Optional[int] = None
    visited: bool = False

class RestaurantCreate(RestaurantBase):
    pass

class Restaurant(RestaurantBase):
    id: int

    class Config:
        orm_mode = True
    