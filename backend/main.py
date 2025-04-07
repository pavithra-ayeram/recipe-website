import os 
from fastapi import FastAPI, HTTPException, status, Form, Request, Depends
from fastapi.staticfiles import StaticFiles 
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from . import models 
from .database import engine 
from .routes import router 
from backend.routes import router as main_router
from fastapi.responses import RedirectResponse
from fastapi.exceptions import RequestValidationError
from starlette.requests import Request
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.orm import Session
from . import models, database
from .database import SessionLocal
from .auth import create_access_token


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

@app.post("/login")
def login(payload: models.LoginRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()

    if user is None or not user.verify_password(payload.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

	
@app.get("/signup", response_class=HTMLResponse) 
async def read_signup(): 
	return FileResponse(os.path.join(pages_path, "signup.html")) 

@app.post("/signup", response_class=HTMLResponse)
async def signup(
    username: str = Form(...), 
    password: str = Form(...), 
    email: str = Form(...),
    db: Session = Depends(database.get_db)
):
    # Check if username or email already exists
    existing_user = db.query(models.User).filter(
        (models.User.username == username) | (models.User.email == email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )

    # Create a new user and set their password
    new_user = models.User(username=username, email=email)
    new_user.set_password(password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Return a success page or redirect
    return FileResponse(os.path.join(pages_path, "login.html"))
	
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
