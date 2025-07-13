# CookBook – Recipe Management System

## Overview
CookBook is a full-stack web application built with FastAPI that allows users to explore, search, and manage recipes with filters for ingredients, cooking time, dietary needs, and appliances.

## Tech Stack
- Backend: Python, FastAPI
- Frontend: HTML, CSS, JavaScript
- Database: MySQL

## Features
- Filter recipes by ingredients, allergens, calories, and time.
- Device-based filtering (e.g., microwave, oven).
- Debug panel for internal diagnostics and query testing.
- RESTful API with dynamic routing and modular structure.
- Responsive frontend using HTML, CSS, and JavaScript.

## Dataset / DB Structure
- `recipes` – Recipe ID, title, steps, time, servings, devices.
- `ingredients` – Ingredient ID, name, category.
- `recipe_ingredient` – Mapping between recipes and ingredients.
- `users` – Basic user info and preferences.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/pavithra-ayeram/recipe-website.git
   cd recipe-website
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Ensure your MySQL database is configured correctly in the project settings.

## How to Use
1. Start the app:
   ```bash
   uvicorn main:app --reload
   ```
2. Open your browser and go to:
   ```
   http://127.0.0.1:8000
   ```
3. Use the search and filter bar to narrow down recipes.
4. Test backend routes via `/docs` (Swagger UI).

## Conclusion
CookBook simplifies recipe exploration with a clean UI and powerful backend filtering. It is ideal for foodies and developers alike. 

Live demo: [https://recipe-website-516y.onrender.com/](https://recipe-website-516y.onrender.com/)
