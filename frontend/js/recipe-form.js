document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("recipe-form");
    const recipeName = document.getElementById("recipe-name");
    const cookingTime = document.getElementById("cooking-time");
    const recipeSteps = document.getElementById("recipe-steps");
    const recipeIngredients = document.getElementById("recipe-ingredients");
    const cookingDevices = document.getElementById("cooking-devices");
    const errorContainer = document.getElementById("error-messages");

    // Image preview functionality
    const imageInput = document.getElementById("recipe-image");
    const previewImage = document.getElementById("preview");
    
    if (imageInput) {
        imageInput.addEventListener("change", function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        errorContainer.innerHTML = "";
        let isValid = true;

        if (recipeName.value.trim() === "") {
            showError("Recipe name is required.", recipeName);
            isValid = false;
        } else {
            setValid(recipeName);
        }

        if (cookingTime.value.trim() === "" || isNaN(cookingTime.value) || cookingTime.value <= 0) {
            showError("Cooking time must be a positive number.", cookingTime);
            isValid = false;
        } else {
            setValid(cookingTime);
        }

        if (recipeSteps.value.trim() === "") {
            showError("Please provide recipe steps.", recipeSteps);
            isValid = false;
        } else {
            setValid(recipeSteps);
        }

        if (isValid) {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                window.location.href = "/login";
                return;
            }
            
            // Call the API to add recipe
            fetch('/api/recipes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: recipeName.value.trim(),
                    description: cookingDevices.value.trim(),
                    instructions: recipeSteps.value.trim()
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.detail || 'Failed to add recipe');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert("Recipe added successfully!");
                form.reset();
                previewImage.src = "";
                previewImage.style.display = "none";
            })
            .catch(error => {
                showError(error.message, recipeName);
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