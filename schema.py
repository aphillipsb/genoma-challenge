from typing import Optional
from pydantic import BaseModel

class Restaurant(BaseModel):
    id: int
    name: str
    location: str
    food_type: str
    qualification: Optional[int] = None
    visited: bool = False

    class Config:
        orm_mode = True