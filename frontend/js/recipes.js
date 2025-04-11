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
    
            const textNode = document.createTextNode(filter);
            const removeBtn = document.createElement("span");
            removeBtn.textContent = "❌";
            removeBtn.style.cursor = "pointer";
            removeBtn.addEventListener("click", () => {
                removeFilterTag(filter);
            });
    
            tag.appendChild(textNode);
            tag.appendChild(removeBtn);
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
        let url = "https://your-backend-api.com/recipes";
        const params = new URLSearchParams(filters).toString();
        if (params) url += `?${params}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayRecipes(data); // Display results
            })
            .catch(error => console.error("Error fetching recipes:", error));
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
