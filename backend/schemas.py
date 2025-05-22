from pydantic import BaseModel
from typing import List, Optional

# -------------------- User Schemas --------------------

class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    model_config = {
        "from_attributes": True
    }

class UserLogin(BaseModel):
    email: str
    password: str

# -------------------- Allergen Schemas --------------------

class AllergenBase(BaseModel):
    name: str

class AllergenCreate(AllergenBase):
    pass

class Allergen(AllergenBase):
    id: int

    model_config = {
        "from_attributes": True
    }

# -------------------- Ingredient Schemas --------------------

class IngredientBase(BaseModel):
    name: str

class IngredientCreate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int

    model_config = {
        "from_attributes": True
    }

# -------------------- Recipe Schemas --------------------

class RecipeBase(BaseModel):
    title: str
    description: str
    instructions: str
    times: int    
    serves: Optional[str] = None 
    devices: Optional[str] = None
    image: Optional[str] = None
    calories: Optional[int] = None
    diet_type: Optional[str] = None
    difficulty_level: Optional[str] = None
    cuisine: Optional[str] = None

class RecipeCreate(RecipeBase):
    ingredient_ids: Optional[List[int]] = []
    allergen_ids: Optional[List[int]] = []

class Recipe(RecipeBase):
    id: int
    ingredients: List[Ingredient] = []
    allergens: List[Allergen] = []

    model_config = {
        "from_attributes": True
    }

