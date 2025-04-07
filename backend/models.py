from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    recipes = relationship("Recipe", back_populates="owner")

    def set_password(self, password: str):
        self.hashed_password = pwd_context.hash(password)

    def verify_password(self, password: str):
        return pwd_context.verify(password, self.hashed_password)

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

class LoginRequest(BaseModel):
    email: str
    password: str
