from sqlalchemy.orm import Session, joinedload
from app.models import Recipe, Ingredient, Allergen, User
from app.database import SessionLocal
import logging

def seed_database(db):

    # Add dummy users (only if not present)
    for i in range(1, 7):
        if not db.query(User).filter_by(id=i).first():
            db.add(User(id=i, username=f"user{i}", email=f"user{i}@mail.com", hashed_password="hashed"))

    db.commit()


    # Seed Ingredients & Allergens
    ingredient_names = [
        "potato", "cauliflower", "carrot", "cream", "spinach", "garlic",
        "ginger", "bell pepper", "paneer", "tomato", "onion", "pasta", "cucumber"
    ]
    allergen_names = ["dairy", "gluten", "nuts"]

    ingredients = [Ingredient(name=name) for name in ingredient_names]
    allergens = [Allergen(name=name) for name in allergen_names]

    db.add_all(ingredients + allergens)
    db.commit()

    # Create name-to-instance maps for relationships
    ingredient_map = {ing.name: ing for ing in db.query(Ingredient).all()}
    allergen_map = {alg.name: alg for alg in db.query(Allergen).all()}

    # Recipe data
    recipes = [
        {
            "title": "Aloo Gobi",
            "description": "A dry Indian curry made with potatoes (aloo) and cauliflower (gobi).",
            "instructions": "Boil vegetables, sauté with spices, and cook until tender.",
            "times": 30,
            "serves": "2",
            "devices": "pan",
            "image": "aloo-gobi.jpg",
            "calories": 200,
            "diet_type": "Vegetarian",
            "difficulty_level": "Easy",
            "cuisine": "Indian",
            "ingredients": ["potato", "cauliflower"],
            "allergens": [],
        },
        {
            "title": "Creamy Carrot Soup", 
            "description": "Smooth carrot soup with cream and spices.",
            "instructions": "Cook carrots, blend with cream, season and serve hot.",
            "times": 25,
            "serves": "2",
            "devices": "blender",
            "image": "creamy-carrot-soup.jpg",
            "calories": 180,
            "diet_type": "Vegetarian",
            "difficulty_level": "Easy",
            "cuisine": "Global",
            "ingredients": ["carrot", "cream"],
            "allergens": ["dairy"],
        },
        {
            "title": "Garlic Spinach Stir Fry",
            "description": "Quick stir-fried spinach with garlic.",
            "instructions": "Sauté garlic in oil, add spinach, stir-fry and season.",
            "times": 10,
            "serves": "1",
            "devices": "wok",
            "image": "garlic-spinach-stir-fry.jpg",
            "calories": 100,
            "diet_type": "Vegan",
            "difficulty_level": "Easy",
            "cuisine": "Asian",
            "ingredients": ["spinach", "garlic"],
            "allergens": [],
        },
        {
            "title": "Ginger Garlic Stir Fry",
            "description": "Mixed veggies stir-fried with ginger and garlic.",
            "instructions": "Chop and fry veggies with ginger garlic paste.",
            "times": 20,
            "serves": "2",
            "devices": "pan",
            "image": "ginger-garlic-stir-fry.jpg",
            "calories": 150,
            "diet_type": "Vegan",
            "difficulty_level": "Medium",
            "cuisine": "Asian",
            "ingredients": ["garlic", "ginger", "onion"],
            "allergens": [],
        },
        {
            "title": "Mixed Veggie Soup",
            "description": "Hearty soup made with assorted vegetables.",
            "instructions": "Boil vegetables, blend slightly, add seasoning and serve.",
            "times": 25,
            "serves": "2",
            "devices": "pot",
            "image": "mixed-veggie-soup.jpg",
            "calories": 160,
            "diet_type": "Vegan",
            "difficulty_level": "Easy",
            "cuisine": "Global",
            "ingredients": ["carrot", "onion", "tomato"],
            "allergens": [],
        },
        {
            "title": "Paneer Butter Masala",
            "description": "Rich and creamy tomato gravy with paneer cubes.",
            "instructions": "Cook tomato gravy, add paneer, butter and cream.",
            "times": 35,
            "serves": "3",
            "devices": "pot",
            "image": "paneer-butter-masala.jpg",
            "calories": 400,
            "diet_type": "Vegetarian",
            "difficulty_level": "Medium",
            "cuisine": "Indian",
            "ingredients": ["paneer", "tomato", "cream"],
            "allergens": ["dairy"],
        },
        {
            "title": "Paneer Tikka",
            "description": "Grilled paneer cubes marinated in spices.",
            "instructions": "Marinate paneer, skewer and grill.",
            "times": 30,
            "serves": "2",
            "devices": "oven",
            "image": "paneer-tikka.jpg",
            "calories": 300,
            "diet_type": "Vegetarian",
            "difficulty_level": "Hard",
            "cuisine": "Indian",
            "ingredients": ["paneer", "onion", "bell pepper"],
            "allergens": ["dairy"],
        },
        {
            "title": "Potato Paneer Cutlet",
            "description": "Fried cutlets made with potato and paneer.",
            "instructions": "Mix ingredients, shape into cutlets and shallow fry.",
            "times": 25,
            "serves": "2",
            "devices": "pan",
            "image": "potato-paneer-cutlet.jpg",
            "calories": 320,
            "diet_type": "Vegetarian",
            "difficulty_level": "Medium",
            "cuisine": "Indian",
            "ingredients": ["potato", "paneer"],
            "allergens": ["dairy"],
        },
        {
            "title": "Spicy Potato Curry",
            "description": "Hot and tangy potato curry.",
            "instructions": "Boil potatoes, cook with spicy gravy.",
            "times": 20,
            "serves": "2",
            "devices": "pot",
            "image": "spicy-potato-curry.jpg",
            "calories": 280,
            "diet_type": "Vegan",
            "difficulty_level": "Medium",
            "cuisine": "Indian",
            "ingredients": ["potato", "tomato", "onion"],
            "allergens": [],
        },
        {
            "title": "Stuffed Bell Peppers",
            "description": "Bell peppers stuffed with spiced potato mix.",
            "instructions": "Stuff peppers and bake until soft.",
            "times": 30,
            "serves": "2",
            "devices": "oven",
            "image": "stuffed-bell-peppers.jpg",
            "calories": 250,
            "diet_type": "Vegetarian",
            "difficulty_level": "Hard",
            "cuisine": "Global",
            "ingredients": ["potato", "bell pepper"],
            "allergens": [],
        },
        {
            "title": "Tomato Cucumber Salad",
            "description": "Refreshing summer salad.",
            "instructions": "Chop veggies, toss with lemon juice and herbs.",
            "times": 10,
            "serves": "1",
            "devices": "bowl",
            "image": "tomato-cucumber-salad.jpg",
            "calories": 80,
            "diet_type": "Vegan",
            "difficulty_level": "Easy",
            "cuisine": "Global",
            "ingredients": ["tomato", "cucumber"],
            "allergens": [],
        },
        {
            "title": "Tomato Garlic Pasta",
            "description": "Italian pasta tossed in tomato and garlic sauce.",
            "instructions": "Cook pasta, prepare tomato garlic sauce, mix and serve.",
            "times": 25,
            "serves": "2",
            "devices": "pot",
            "image": "tomato-garlic-pasta.jpg",
            "calories": 350,
            "diet_type": "Vegetarian",
            "difficulty_level": "Medium",
            "cuisine": "Italian",
            "ingredients": ["pasta", "tomato", "garlic"],
            "allergens": ["gluten"],
        },
    ]

    # Assign owner_id and create recipes
    for i, recipe_data in enumerate(recipes):
        ingredients_list = recipe_data.pop("ingredients", [])
        allergens_list = recipe_data.pop("allergens", [])
        recipe_data["owner_id"] = (i % 6) + 1

        recipe = Recipe(**recipe_data)
        recipe.ingredients = [ingredient_map[name] for name in ingredients_list if name in ingredient_map]
        recipe.allergens = [allergen_map[name] for name in allergens_list if name in allergen_map]

        db.add(recipe)

    db.commit()
    db.close()

    logging.basicConfig(level=logging.INFO)