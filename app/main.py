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
from pathlib import Path
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException

# Add the parent directory to the path so Python can find the backend modules
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Import backend modules
from app.database import engine
from app.models import Recipe
from app.routes import router
from app.dependencies import get_db

app = FastAPI()
app.include_router(router, prefix="/api")


# Configure CORS - IMPORTANT: Make sure these settings allow your frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to specific domains
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Make sure POST is included
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
):
    
    UPLOAD_FOLDER = "/assets/images/uploads"
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    filename = Path(image.filename).name  # strips directory info if any
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    
    # Save image to disk
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Save the rest to your database...
    # Example:
    # db.save_recipe(title, description, ..., image_path)

    return JSONResponse(content={"message": "Recipe created successfully", "image_url": f"/assets/images/uploads/{filename}"})

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