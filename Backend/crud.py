from sqlalchemy.orm import Session
import models, schema

def get_restaurants(db: Session):
    return db.query(models.Restaurant).all()

def create_restaurant(db: Session, restaurant: schema.RestaurantCreate):
    db_restaurant = models.Restaurant(**restaurant.dict())
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant

def delete_restaurant(db: Session, restaurant_id: int):
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()
    db.delete(restaurant)
    db.commit()
    db.refresh(restaurant)
    return restaurant

