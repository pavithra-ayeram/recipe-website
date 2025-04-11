import os
import sys
import uvicorn
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
import backend.models as models

# Add the parent directory to the path so Python can find the backend modules
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Import backend modules
from backend.database import engine
from backend import models
from backend.routes import router

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/assets", StaticFiles(directory=os.path.join(current_dir, "frontend/assets")), name="assets")
app.mount("/css", StaticFiles(directory=os.path.join(current_dir, "frontend/css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(current_dir, "frontend/js")), name="js")

# Include API routes
app.include_router(router)  # Removed prefix as it's already in the router

# Setup templates
templates = Jinja2Templates(directory=os.path.join(current_dir, "frontend/pages"))

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

@app.get("/add-recipe", response_class=HTMLResponse)
async def add_recipe_page(request: Request):
    return templates.TemplateResponse("add-recipe.html", {"request": request})

@app.get("/add-ingredient", response_class=HTMLResponse)
async def add_ingredient_page(request: Request):
    return templates.TemplateResponse("add-ingred.html", {"request": request})

@app.get("/{path:path}", response_class=HTMLResponse)
async def catch_all(request: Request, path: str):
    return templates.TemplateResponse("404.html", {"request": request})

# if __name__ == "__main__":
#     uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)