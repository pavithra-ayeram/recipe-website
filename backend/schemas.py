from pydantic import BaseModel, EmailStr
from typing import Optional

# Base schema for User
class UserBase(BaseModel):
    email: str
    username: str

# Schema for creating a new user (includes password)
class UserCreate(UserBase):
    password: str

# Schema for user response (when fetching user data)
class User(UserBase):
    id: int

    class Config:
        orm_mode = True  # This tells Pydantic to treat the model like an ORM model

# Schema for user login (email and password)
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema for user response (excluding password)
class UserOut(BaseModel):
    id: int
    email: str
    username: str

    class Config:
        orm_mode = True

# Recipe schemas
class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: str

# Schema for creating a new recipe
class RecipeCreate(RecipeBase):
    pass

# Schema for recipe response
class Recipe(RecipeBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

# Ingredient schemas
class IngredientBase(BaseModel):
    name: str

# Schema for creating a new ingredient
class IngredientCreate(IngredientBase):
    pass

# Schema for ingredient response
class Ingredient(IngredientBase):
    id: int

    class Config:
        orm_mode = True

# Login data schema
class LoginData(BaseModel):
    email: EmailStr
    password: str

# Signup data schema
class SignupData(BaseModel):
    username: str
    email: EmailStr
    password: str
