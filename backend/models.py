from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base

# Association table for recipe-ingredient relationship
recipe_ingredient = Table(
    'recipe_ingredient',
    Base.metadata,
    Column('recipe_id', Integer, ForeignKey('recipes.id')),
    Column('ingredient_id', Integer, ForeignKey('ingredients.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(100))
    recipes = relationship("Recipe", back_populates="owner")

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    description = Column(String(500))
    instructions = Column(String(2000))
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="recipes")
    ingredients = relationship("Ingredient", secondary=recipe_ingredient, back_populates="recipes")

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True)
    recipes = relationship("Recipe", secondary=recipe_ingredient, back_populates="ingredients") 

from pydantic import BaseModel

class UserSignup(BaseModel):
    username: str
    email: str
    password: str
    