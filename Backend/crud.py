from sqlalchemy.orm import Session
import models, schema

def get_restaurant_by_id(db: Session, restaurant_id: int):
    return db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()

def get_restaurants(db: Session, location_filter: str):
    location_filter = '%' + location_filter + '%'
    return db.query(models.Restaurant).filter(models.Restaurant.location.like(location_filter)).all()

def create_restaurant(db: Session, restaurant: schema.RestaurantCreate):
    db_restaurant = models.Restaurant(**restaurant.dict())
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant

def update_restaurant(db: Session, restaurant: schema.Restaurant):
    db.query(models.Restaurant).filter(models.Restaurant.id == restaurant.id).update(restaurant.dict())
    db.commit()
    return restaurant

def delete_restaurant(db: Session, restaurant_id: int):
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()
    db.delete(restaurant)
    db.commit()
    return restaurant

