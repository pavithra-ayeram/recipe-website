import os
import sys
import uvicorn
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
import shutil
from contextlib import asynccontextmanager
from pathlib import Path
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException

# Add the parent directory to the path so Python can find the backend modules
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Import backend modules
from app.database import engine, SessionLocal
from app import models
from app.models import Recipe, Base, Ingredient, Allergen, User
from app.routes import router
from app.dependencies import get_db
from app.seed_data import seed_database
from app.auth import get_current_user

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(router, prefix="/api")


# Configure CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"], 
    allow_headers=["*"],
)

# Setup templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/signup", response_class=HTMLResponse)
async def signup_page(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

@app.get("/recipes", response_class=HTMLResponse)
async def recipes_page(request: Request):
    return templates.TemplateResponse("recipes.html", {"request": request})

@app.post("/recipes")
async def create_recipe(
    title: str = Form(...),
    description: str = Form(...),
    instructions: str = Form(...),
    times: int = Form(...),
    serves: int = Form(...),
    devices: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  
):
    try:
        # Ensure upload directory exists
        UPLOAD_FOLDER = "assets/images/uploads"
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        # Save the uploaded image
        filename = Path(image.filename).name
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # Create new Recipe
        new_recipe = Recipe(
            title=title,
            description=description,
            instructions=instructions,
            times=times,
            serves=serves,
            devices=devices,
            image=filename,
            owner_id=current_user.id  
        )

        db.add(new_recipe)
        db.commit()
        db.refresh(new_recipe)

        return JSONResponse(
            content={
                "message": "Recipe created successfully",
                "recipe_id": new_recipe.id,
                "image_url": f"/{image_path}"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recipe creation failed: {str(e)}")

@app.get("/add-recipe", response_class=HTMLResponse)
async def add_recipe_page(request: Request):
    return templates.TemplateResponse("add-recipe.html", {"request": request})

@app.get("/add-ingredient", response_class=HTMLResponse)
async def add_ingredient_page(request: Request):
    return templates.TemplateResponse("add-ingred.html", {"request": request})

@app.get("/recipes/{recipe_id}", response_class=HTMLResponse)
def view_recipe(recipe_id: int, request: Request, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return templates.TemplateResponse("view-recipe.html", {"request": request, "recipe": recipe})


@app.get("/{path:path}", response_class=HTMLResponse)
async def catch_all(request: Request, path: str):
    return templates.TemplateResponse("404.html", {"request": request})


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)