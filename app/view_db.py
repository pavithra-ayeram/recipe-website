from app.database import SessionLocal
from app import models

db = SessionLocal()

# View all users
users = db.query(models.User).all()
print("\nUsers:")
for user in users:
    print(f"ID: {user.id}, Email: {user.email}, Username: {user.username}")

# View all recipes
recipes = db.query(models.Recipe).all()
print("\nRecipes:")
for recipe in recipes:
    print(f"Title: {recipe.title}, Owner ID: {recipe.owner_id}")

db.close()
