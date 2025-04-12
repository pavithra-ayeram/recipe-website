document.addEventListener("DOMContentLoaded", () => {
    // Load recipes when the page loads
    loadRecipes();

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
        if (allergen && !selectedFilters.includes("!"+allergen)) { // Mark allergens with "!" prefix
            addFilterTag("!"+allergen);
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
    
            // Display text (remove "!" prefix for allergens in display)
            const displayText = filter.startsWith("!") ? filter.substring(1) : filter;
            const textNode = document.createTextNode(displayText);
            
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
        applyFilters();
    });

    function applyFilters() {
        const filters = {
            ingredients: selectedFilters.filter(f => !f.startsWith("!")),
            allergens: selectedFilters.filter(f => f.startsWith("!")).map(a => a.substring(1)),
            maxCalories: caloriesInput.value,
            maxTime: timeInput.value
        };

        loadRecipes(filters);
    }

    // Recipe data - this is our local fallback data
    const recipeData = [
        {
            id: "R001",
            name: "Paneer Butter Masala", 
            image: "/assets/paneer-butter-masala.jpg",
            time: 30,
            serves: 3,
            devices: ["Stove"],
            ingredients: ["Paneer", "Butter", "Tomato", "Spices"],
            calories: 450,
            allergens: ["Dairy"]
        },
        {
            id: "R002",
            name: "Chocolate Mug Cake",
            image: "/assets/mug-cake.jpg", 
            time: 5,
            serves: 1,
            devices: ["Microwave"],
            ingredients: ["Flour", "Sugar", "Milk", "Cocoa"],
            calories: 300,
            allergens: ["Gluten", "Dairy"]
        },
        {
            id: "R003",
            name: "Lentil Soup",
            image: "/assets/lentil-soup.jpg",
            time: 25,
            serves: 4,
            devices: ["Stove"],
            ingredients: ["Lentils", "Carrot", "Garlic", "Onion"],
            calories: 220,
            allergens: []
        },
        {
            id: "R004",
            name: "Fruit Salad",
            image: "/assets/fruit-salad.jpg",
            time: 0,
            serves: 2,
            devices: ["None"],
            ingredients: ["Apple", "Banana", "Grapes"],
            calories: 120,
            allergens: []
        }
    ];

    // Load recipes function - with error handling and fallback to local data
    function loadRecipes(filters = {}) {
        // First try to load from the API with a fetch call
        fetch('/api/recipes')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // If successful, filter and display the API data
                filterAndDisplayRecipes(data, filters);
            })
            .catch(error => {
                console.warn('Error fetching recipes from API, using local data instead:', error);
                // On failure, use our local recipeData
                filterAndDisplayRecipes(recipeData, filters);
            });
    }

    // Function to filter and display recipes
    function filterAndDisplayRecipes(recipes, filters) {
        let filteredRecipes = [...recipes];

        // Apply ingredient filters
        if (filters.ingredients && filters.ingredients.length > 0) {
            filteredRecipes = filteredRecipes.filter(recipe => {
                return filters.ingredients.every(ingredient => 
                    recipe.ingredients.some(i => i.toLowerCase().includes(ingredient.toLowerCase()))
                );
            });
        }

        // Apply allergen filters
        if (filters.allergens && filters.allergens.length > 0) {
            filteredRecipes = filteredRecipes.filter(recipe => {
                return !filters.allergens.some(allergen => 
                    recipe.allergens && recipe.allergens.some(a => a.toLowerCase().includes(allergen.toLowerCase()))
                );
            });
        }

        // Apply max calories filter
        if (filters.maxCalories && !isNaN(filters.maxCalories)) {
            filteredRecipes = filteredRecipes.filter(recipe => 
                recipe.calories <= parseInt(filters.maxCalories)
            );
        }

        // Apply max time filter
        if (filters.maxTime && !isNaN(filters.maxTime)) {
            filteredRecipes = filteredRecipes.filter(recipe => 
                recipe.time <= parseInt(filters.maxTime)
            );
        }

        displayRecipes(filteredRecipes);
    }

    // Display recipes on the page
    function displayRecipes(recipes) {
        const resultsDiv = document.getElementById("recipe-results");
        
        // Check if the element exists
        if (!resultsDiv) {
            console.error("Cannot find element with ID 'recipe-results'");
            return;
        }

        // Clear previous results
        resultsDiv.innerHTML = "";

        // Debug log
        console.log("Displaying recipes:", recipes);

        if (!recipes || recipes.length === 0) {
            resultsDiv.innerHTML = "<p class='no-results'>No recipes found matching your criteria.</p>";
            return;
        }

        recipes.forEach(recipe => {
            // Create a new recipe card element
            const recipeCard = document.createElement("div");
            recipeCard.className = "recipe-card";
            
            // Handle potential missing data
            const recipeImage = recipe.image || "/assets/default-recipe.jpg";
            const recipeDevices = recipe.devices ? recipe.devices.join(", ") : "None";
            const recipeIngredients = recipe.ingredients ? recipe.ingredients.join(", ") : "Not specified";
            
            // Create recipe card HTML
            recipeCard.innerHTML = `
                <img src="${recipeImage}" alt="${recipe.name}" class="recipe-img">
                <h2>${recipe.name}</h2>
                <p><strong>Time:</strong> ${recipe.time} mins, <strong>Serves:</strong> ${recipe.serves}, <strong>Devices:</strong> ${recipeDevices}</p>
                <p><strong>Ingredients:</strong> ${recipeIngredients}</p>
                ${recipe.allergens && recipe.allergens.length > 0 ? `<p><strong>Allergens:</strong> ${recipe.allergens.join(", ")}</p>` : ''}
                <a href="/recipe/${recipe.id}" class="btn">View Recipe</a>
            `;
            
            resultsDiv.appendChild(recipeCard);
        });
    }

    // Sidebar toggle event
    const sidebarToggle = document.getElementById("sidebar-toggle");
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            toggleSidebar();
        });
    }

    // Function to handle sidebar toggle action
    function toggleSidebar() {
        sidebar.classList.toggle("collapsed");
        
        // Adjust main content margin when sidebar is collapsed
        if (sidebar.classList.contains("collapsed")) {
            mainContent.style.marginLeft = "80px"; // Width of collapsed sidebar + padding
        } else {
            mainContent.style.marginLeft = "350px"; // Width of expanded sidebar + padding
        }
    }
});