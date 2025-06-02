from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base

# Association table for many-to-many relationship between recipes and ingredients
recipe_ingredient = Table(
    'recipe_ingredient',
    Base.metadata,
    Column('recipe_id', Integer, ForeignKey('recipes.id')),
    Column('ingredient_id', Integer, ForeignKey('ingredients.id'))
)

# -------------------------------
# SQLAlchemy Models
# -------------------------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(100))

    recipes = relationship("Recipe", back_populates="owner")

recipe_allergen = Table(
    'recipe_allergen',
    Base.metadata,
    Column('recipe_id', Integer, ForeignKey('recipes.id')),
    Column('allergen_id', Integer, ForeignKey('allergens.id'))
)

class Allergen(Base):
    __tablename__ = "allergens"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True)

    recipes = relationship(
        "Recipe",
        secondary=recipe_allergen,
        back_populates="allergens"
    )
    

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    description = Column(String(500))
    instructions = Column(String(2000))
    times = Column(Integer)
    serves = Column(String)
    devices = Column(String)
    image = Column(String(200)) 
    calories = Column(Integer)  
    diet_type = Column(String(100))  
    difficulty_level = Column(String(50))  
    cuisine = Column(String(100))  

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="recipes")

    ingredients = relationship(
        "Ingredient",
        secondary=recipe_ingredient,
        back_populates="recipes"
    )

    allergens = relationship(
        "Allergen",
        secondary=recipe_allergen,
        back_populates="recipes"
    )


class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True)

    recipes = relationship(
        "Recipe",
        secondary=recipe_ingredient,
        back_populates="ingredients"
    )

