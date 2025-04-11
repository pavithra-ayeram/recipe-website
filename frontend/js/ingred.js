document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("recipe-form");
    const ingredName = document.getElementById("ingredient-name");
    const category = document.getElementById("category");
    const errorContainer = document.getElementById("error-messages");

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        errorContainer.innerHTML = "";
        let isValid = true;

        if (ingredName.value.trim() === "") {
            showError("Ingredient name is required.", ingredName);
            isValid = false;
        } else {
            setValid(ingredName); // Fixed: changed recipeName to ingredName
        }

        if (category.value.trim() === "") {
            showError("Category is required.", category);
            isValid = false;
        } else {
            setValid(category);
        }

        if (isValid) {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                window.location.href = "/login";
                return;
            }
            
            // Call the API to add ingredient
            fetch('/api/ingredients/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: ingredName.value.trim()
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.detail || 'Failed to add ingredient');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert("Ingredient added successfully!");
                form.reset();
            })
            .catch(error => {
                showError(error.message, ingredName);
            });
        }
    });

    function showError(message, input) {
        const error = document.createElement("p");
        error.textContent = message;
        error.classList.add("error-text");
        errorContainer.appendChild(error);
        setInvalid(input);
    }

    function setValid(input) {
        input.classList.remove("invalid");
        input.classList.add("valid");
    }

    function setInvalid(input) {
        input.classList.remove("valid");
        input.classList.add("invalid");
    }
});