from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

from pydantic import BaseModel
from typing import Optional

class RecipeBase(BaseModel):
    title: str
    instructions: str
    times: str
    serves: str
    devices: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class Recipe(RecipeBase):
    id: int

    model_config = {
        "from_attributes": True
    }

class IngredientBase(BaseModel):
    name: str

class IngredientCreate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int
    class Config:
        from_attributes = True 