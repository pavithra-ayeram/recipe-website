const token = localStorage.getItem("token");
if (!token) {
    alert("Please log in to view recipes.");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    fetchRecipes(); // Initial fetch

    // Elements for filter controls
    const ingredientInput = document.getElementById("ingredient-input");
    const addIngredientButton = document.getElementById("add-ingredient");
    const allergenInput = document.getElementById("allergen-input");
    const avoidAllergenButton = document.getElementById("avoid-allergen");
    const selectedFiltersDiv = document.getElementById("selected-filters");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    const caloriesInput = document.getElementById("calories-filter");
    const timeInput = document.getElementById("time-filter");

    // Track selected filters
    let selectedFilters = [];

    // Add ingredient when button is clicked
    addIngredientButton.addEventListener("click", () => {
        const ingredient = ingredientInput.value.trim();
        if (ingredient && !selectedFilters.includes(ingredient)) {
            addFilterTag(ingredient);
            ingredientInput.value = "";
        }
    });

    // Allow "Enter" key to add an ingredient
    ingredientInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addIngredientButton.click();
        }
    });

    // Add allergen when button is clicked
    avoidAllergenButton.addEventListener("click", () => {
        const allergen = allergenInput.value.trim();
        if (allergen && !selectedFilters.includes(allergen)) {
            addFilterTag(allergen);
            allergenInput.value = "";
        }
    });

    // Allow "Enter" key to add an allergen
    allergenInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            avoidAllergenButton.click();
        }
    });

    // Add filter tag to UI
    function addFilterTag(filter) {
        selectedFilters.push(filter);
        updateFiltersUI();
    }

    // Remove filter tag
    function removeFilterTag(filter) {
        selectedFilters = selectedFilters.filter(item => item !== filter);
        updateFiltersUI();
    }

    // Update selected filters UI
    function updateFiltersUI() {
        selectedFiltersDiv.innerHTML = "";
        selectedFilters.forEach(filter => {
            const tag = document.createElement("div");
            tag.classList.add("filter-tag");
            tag.innerHTML = `${filter} <span onclick="removeFilterTag('${filter}')">❌</span>`;
            selectedFiltersDiv.appendChild(tag);
        });
    }

    // Apply filters when user clicks "Apply Filters"
    document.getElementById("apply-filters").addEventListener("click", () => {
        const filters = {
            selectedFilters: selectedFilters,
            maxCalories: caloriesInput.value,
            maxTime: timeInput.value
        };

        fetchRecipes(filters);
    });

    // Fetch filtered recipes
    function fetchRecipes(filters = {}) {
        let url = "http://127.0.0.1:8000/api/recipes/";
        const token = localStorage.getItem("token");
    
        // Build query string only for supported filters
        const queryParams = new URLSearchParams();
        if (filters.maxCalories) queryParams.append("max_calories", filters.maxCalories);
        if (filters.maxTime) queryParams.append("max_time", filters.maxTime);
    
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }
    
        fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    alert("Unauthorized. Please log in again.");
                    window.location.href = "login.html";
                }
                throw new Error("Failed to fetch recipes.");
            }
            return response.json();
        })
        .then(data => {
            displayRecipes(data);
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
        });
    }
    

    // Display recipes dynamically
    function displayRecipes(recipes) {
        const resultsDiv = document.getElementById("recipe-results");
        resultsDiv.innerHTML = ""; // Clear previous results

        if (recipes.length === 0) {
            resultsDiv.innerHTML = "<p>No recipes found.</p>";
            return;
        }

        recipes.forEach(recipe => {
            const recipeCard = `
                <div class="recipe-card">
                    <h3>${recipe.name}</h3>
                    <img src="${recipe.image}" alt="${recipe.name}">
                    <p>Cooking Time: ${recipe.time} mins</p>
                    <p>Calories: ${recipe.calories}</p>
                </div>
            `;
            resultsDiv.innerHTML += recipeCard; // Add each recipe card
        });
    }

    // Sidebar toggle event
    const sidebarToggle = document.getElementById("sidebar-toggle");
    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("full-width");
    });

    // Function to handle sidebar toggle action
    function toggleSidebar() {
        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("full-width");
    }
});

document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});


document.addEventListener("DOMContentLoaded", () => {
    const testBtn = document.getElementById("test-connection");

    testBtn.addEventListener("click", () => {
        const token = localStorage.getItem("token");

        fetch("http://127.0.0.1:8000/api/recipes/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (res.ok) {
                console.log("✅ Backend is connected!");
                return res.json();
            } else {
                console.warn("⚠️ Backend responded with status:", res.status);
            }
        })
        .then(data => {
            if (data) {
                console.log("📦 Response data:", data);
                alert("Success! Check console for response.");
            }
        })
        .catch(err => {
            console.error("❌ Error reaching backend:", err);
            alert("Connection failed. Check console.");
        });
    });
});
