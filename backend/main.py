import os 
from fastapi import FastAPI 
from fastapi.staticfiles import StaticFiles 
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from . import models 
from .database import engine 
from .routes import router 
from fastapi import Form, Request
from backend.routes import router as main_router
from fastapi.responses import RedirectResponse
from fastapi.exceptions import RequestValidationError
from starlette.requests import Request
from starlette.exceptions import HTTPException as StarletteHTTPException


models. Base.metadata.create_all(bind=engine) 
app = FastAPI() 

# Mount static and pages directories 
frontend_path = os.path.join(os.path.dirname(__file__), "../frontend") 
static_path = os.path.join(frontend_path, "static") 
pages_path = os.path.join(frontend_path, "pages") 
app.mount("/static", StaticFiles(directory=static_path), name="static") 
app.mount("/assets", StaticFiles(directory=os.path.join(static_path, "assets")), name="assets") 

# API routes 
app.include_router(main_router)

@app.get("/", response_class=HTMLResponse)
async def read_index():
    return FileResponse(os.path.join(pages_path, "index.html"))

# Page routes 
@app.get("/login", response_class=HTMLResponse)
async def read_login():
    return FileResponse(os.path.join(pages_path, "login.html"))
	
@app.get("/signup", response_class=HTMLResponse) 
async def read_signup(): 
	return FileResponse(os.path.join(pages_path, "signup.html")) 
	
@app.get("/recipes", response_class=HTMLResponse) 
async def read_recipes(): 
	return FileResponse(os.path.join(pages_path, "recipes.html")) 

@app.exception_handler(StarletteHTTPException)
async def custom_404_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        return FileResponse(os.path.join(pages_path, "404.html"), status_code=404)
    
    # Let FastAPI/Starlette handle all other HTTP exceptions (like 405)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.get("/404", response_class=HTMLResponse)
async def read_404():
    return FileResponse(os.path.join(pages_path, "404.html"))
