# Update your routes.py file to ensure it properly handles the login and signup routes

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .database import get_db
from .auth import get_current_user, create_access_token, verify_password, get_password_hash

router = APIRouter()

# Authentication routes - make sure these match the URLs in your frontend code
@router.post("/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# Recipe routes
@router.post("/recipes/", response_model=schemas.Recipe)
def create_recipe(
    recipe: schemas.RecipeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_recipe = models.Recipe(
        title=recipe.title,
        description=recipe.description,
        instructions=recipe.instructions,
        owner_id=current_user.id
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@router.get("/recipes/", response_model=List[schemas.Recipe])
def read_recipes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    recipes = db.query(models.Recipe).filter(
        models.Recipe.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    return recipes

# Ingredient routes
@router.post("/ingredients/", response_model=schemas.Ingredient)
def create_ingredient(
    ingredient: schemas.IngredientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_ingredient = models.Ingredient(name=ingredient.name)
    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

@router.get("/ingredients/", response_model=List[schemas.Ingredient])
def read_ingredients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    ingredients = db.query(models.Ingredient).offset(skip).limit(limit).all()
    return ingredients 