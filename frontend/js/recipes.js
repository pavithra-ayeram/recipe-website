document.addEventListener("DOMContentLoaded", () => {
    loadRecipes();

    const ingredientInput = document.getElementById("ingredient-input");
    const addIngredientButton = document.getElementById("add-ingredient");
    const allergenInput = document.getElementById("allergen-input");
    const avoidAllergenButton = document.getElementById("avoid-allergen");
    const selectedFiltersDiv = document.getElementById("selected-filters");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    const caloriesInput = document.getElementById("calories-filter");
    const timeInput = document.getElementById("time-filter");

    let selectedFilters = [];

    addIngredientButton.addEventListener("click", () => {
        const ingredient = ingredientInput.value.trim();
        if (ingredient && !selectedFilters.includes(ingredient)) {
            addFilterTag(ingredient);
            ingredientInput.value = "";
        }
    });

    ingredientInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") addIngredientButton.click();
    });

    avoidAllergenButton.addEventListener("click", () => {
        const allergen = allergenInput.value.trim();
        if (allergen && !selectedFilters.includes("!" + allergen)) {
            addFilterTag("!" + allergen);
            allergenInput.value = "";
        }
    });

    allergenInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") avoidAllergenButton.click();
    });

    function addFilterTag(filter) {
        selectedFilters.push(filter);
        updateFiltersUI();
    }

    function removeFilterTag(filter) {
        selectedFilters = selectedFilters.filter(item => item !== filter);
        updateFiltersUI();
    }

    function updateFiltersUI() {
        selectedFiltersDiv.innerHTML = "";
        selectedFilters.forEach(filter => {
            const tag = document.createElement("div");
            tag.classList.add("filter-tag");

            const displayText = filter.startsWith("!") ? filter.substring(1) : filter;
            const textNode = document.createTextNode(displayText);

            const removeBtn = document.createElement("span");
            removeBtn.textContent = "❌";
            removeBtn.style.cursor = "pointer";
            removeBtn.addEventListener("click", () => removeFilterTag(filter));

            tag.appendChild(textNode);
            tag.appendChild(removeBtn);
            selectedFiltersDiv.appendChild(tag);
        });
    }

    document.getElementById("apply-filters").addEventListener("click", () => {
        applyFilters();
    });

    function applyFilters() {
        const filters = {
            ingredients: selectedFilters.filter(f => !f.startsWith("!")),
            allergens: selectedFilters.filter(f => f.startsWith("!")).map(a => a.substring(1)),
            maxCalories: caloriesInput.value ? parseInt(caloriesInput.value) : null,
            maxTime: timeInput.value ? parseInt(timeInput.value) : null
        };

        const params = new URLSearchParams();
        filters.ingredients.forEach(ingredient => params.append("ingredients", ingredient));
        filters.allergens.forEach(allergen => params.append("allergens", allergen));
        if (filters.maxCalories) params.append("max_calories", filters.maxCalories);
        if (filters.maxTime) params.append("max_time", filters.maxTime);

        fetch(`http://localhost:8000/api/recipes?${params.toString()}`)
            .then(response => response.json())
            .then(data => displayRecipes(data))
            .catch(error => {
                console.error("Error fetching filtered recipes:", error);
                filterAndDisplayRecipes(recipeData, filters);
            });
    }

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

    function loadRecipes() {
        const resultsDiv = document.getElementById("recipe-list");
        resultsDiv.innerHTML = "<p class='loading-text'>Loading recipes...</p>";

        fetch("http://localhost:8000/api/recipes")
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data);
                filterAndDisplayRecipes(data, {});
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                filterAndDisplayRecipes(recipeData, {});
            });
    }

    function filterAndDisplayRecipes(recipes, filters) {
        let filteredRecipes = [...recipes];

        if (filters.ingredients?.length > 0) {
            filteredRecipes = filteredRecipes.filter(recipe =>
                filters.ingredients.every(ing =>
                    recipe.ingredients?.some(i => i.toLowerCase().includes(ing.toLowerCase()))
                )
            );
        }

        if (filters.allergens?.length > 0) {
            filteredRecipes = filteredRecipes.filter(recipe =>
                !filters.allergens.some(allergen =>
                    recipe.allergens?.some(a => a.toLowerCase().includes(allergen.toLowerCase()))
                )
            );
        }

        if (filters.maxCalories) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.calories <= filters.maxCalories);
        }

        if (filters.maxTime) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.time <= filters.maxTime);
        }

        displayRecipes(filteredRecipes);
    }

    function displayRecipes(recipes) {
        const resultsDiv = document.getElementById("recipe-list");

        if (!resultsDiv) {
            console.error("Cannot find element with ID 'recipe-list'");
            return;
        }

        resultsDiv.innerHTML = "";

        if (!recipes || recipes.length === 0) {
            resultsDiv.innerHTML = "<p class='no-results'>No recipes found matching your criteria.</p>";
            return;
        }

        recipes.forEach(recipe => {
            const card = document.createElement("div");
            card.className = "recipe-card";

            const name = recipe.title || recipe.name || "Untitled";
            const image = recipe.image || "/assets/default-recipe.jpg";
            const time = recipe.times || recipe.time || "N/A";
            const serves = recipe.serves || "N/A";
            const devices = Array.isArray(recipe.devices) ? recipe.devices.join(", ") : "N/A";
            const ingredients = Array.isArray(recipe.ingredients)
                ? recipe.ingredients.map(i => (typeof i === "string" ? i : i.name)).join(", ")
                : "N/A";
            const allergens = Array.isArray(recipe.allergens) && recipe.allergens.length > 0
                ? recipe.allergens.map(a => (typeof a === "string" ? a : a.name)).join(", ")
                : null;

            card.innerHTML = `
                <h2>${name}</h2>
                <img src="${image}" alt="${name}" class="recipe-img"/>
                <p><strong>Ingredients:</strong> ${ingredients}</p>
                <p><strong>Time:</strong> ${time} minutes</p>
                <p><strong>Serves:</strong> ${serves}</p>
                <p><strong>Devices:</strong> ${devices}</p>
                ${allergens ? `<p><strong>Allergens:</strong> ${allergens}</p>` : ""}
            `;
            resultsDiv.appendChild(card);
        });
    }

    const sidebarToggle = document.getElementById("sidebar-toggle");
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", toggleSidebar);
    }

    function toggleSidebar() {
        sidebar.classList.toggle("collapsed");
        mainContent.style.marginLeft = sidebar.classList.contains("collapsed") ? "80px" : "350px";
    }
});
