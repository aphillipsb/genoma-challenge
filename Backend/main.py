from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import crud, models, schema
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    'http://localhost:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get('/restaurants/', response_model=List[schema.Restaurant])
def read_restaurants(location_filter: str = '', db: Session=Depends(get_db)):
    restaurants = crud.get_restaurants(db=db, location_filter=location_filter)
    return restaurants

@app.post('/restaurants/', response_model=schema.Restaurant)
def create_restaurant(restaurant: schema.RestaurantCreate, db: Session=Depends(get_db)):
    return crud.create_restaurant(db=db, restaurant=restaurant)

@app.post('/restaurants/update', response_model=schema.Restaurant)
def update_restaurant(restaurant: schema.Restaurant, db: Session=Depends(get_db)):
    if crud.get_restaurant_by_id(db=db, restaurant_id=restaurant.id):
        return crud.update_restaurant(db=db, restaurant=restaurant)
    else:
        raise HTTPException(status_code=400, detail='Restaurant no existe')

@app.delete('/restaurants/{restaurant_id}', response_model=schema.Restaurant)
def delete_restaurant(restaurant_id: int, db: Session=Depends(get_db)):
    return crud.delete_restaurant(db=db, restaurant_id=restaurant_id)
