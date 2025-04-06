from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .models import User
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse
from .database import get_db
from .auth import get_current_user, create_access_token, verify_password, get_password_hash
from .schemas import LoginData, SignupData
from .utils import verify_password, hash_password
from .database import get_db

router = APIRouter(prefix="/auth")

# Route for user login
@router.post("/login")
async def login_user(data: schemas.UserLogin, db: Session = Depends(get_db)):
    # Your logic for user authentication goes here
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Your token creation logic or redirect can go here
    return {"access_token": create_access_token(data={"sub": user.email}), "token_type": "bearer"}


# Route for user signup
@router.post("/signup")
async def signup_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully!"}

# Recipe routes
@router.post("/recipes/", response_model=schemas.Recipe)
def create_recipe(
    recipe: schemas.RecipeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Create a new recipe associated with the logged-in user
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
    # Fetch recipes created by the current user
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
    # Create a new ingredient
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
    # Fetch all ingredients in the database
    ingredients = db.query(models.Ingredient).offset(skip).limit(limit).all()
    return ingredients
