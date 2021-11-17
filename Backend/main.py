from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List

import crud, models, schema
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get('/restaurants', response_model=List[schema.Restaurant])
def read_restaurants(db: Session=Depends(get_db)):
    restaurants = crud.get_restaurants(db)
    return restaurants

@app.post('/restaurants', response_model=schema.Restaurant)
def create_restaurant(restaurant: schema.RestaurantCreate, db: Session=Depends(get_db)):
    return crud.create_restaurant(db=db, restaurant=restaurant)
    