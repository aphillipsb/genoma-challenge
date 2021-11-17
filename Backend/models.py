from pydantic import BaseModel
from typing import Optional

class Restaurant(BaseModel):
    name: str
    city: str
    country: str
    food_type: str
    qualification: Optional[int] = None
    visted: bool = false