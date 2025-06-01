# PaDhaNiSa <3 — Recipe Management System 🍲

A web app to create, view, filter, and manage delicious recipes by ingredients, time, diet, and cuisine. Built with FastAPI + MySQL + JS.

## Features
- Add/update/delete recipes
- Dynamic filtering by diet, time, device, etc.
- Upload & preview recipe images
- User accounts (with rotating ownership for now 😉)

## Tech Stack
- Backend: FastAPI
- Frontend: HTML/CSS/JavaScript
- DB: MySQL
- ORM: SQLAlchemy

## Setup
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
