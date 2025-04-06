document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const recipeContainer = document.getElementById("recipe-container");

    if (!token) {
        alert("You must be logged in to view the dashboard.");
        window.location.href = "login.html";
        return;
    }

    fetch("http://127.0.0.1:8000/api/recipes/", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    .then(res => {
        if (res.status === 401) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }
        return res.json();
    })
    .then(data => {
        if (data && Array.isArray(data)) {
            renderRecipes(data);
        }
    })
    .catch(err => {
        console.error("Error fetching recipes:", err);
        alert("Failed to load recipes.");
    });

    function renderRecipes(recipes) {
        recipeContainer.innerHTML = "";

        if (recipes.length === 0) {
            recipeContainer.innerHTML = "<p>No recipes found.</p>";
            return;
        }

        recipes.forEach(recipe => {
            const recipeEl = document.createElement("div");
            recipeEl.classList.add("recipe-card");
            recipeEl.innerHTML = `
                <h3>${recipe.title}</h3>
                <p><strong>Description:</strong> ${recipe.description}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            `;
            recipeContainer.appendChild(recipeEl);
        });
    }
});
