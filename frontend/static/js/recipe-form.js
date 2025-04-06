document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("recipe-form");
    const recipeName = document.getElementById("recipe-name");
    const cookingTime = document.getElementById("cooking-time");
    const recipeSteps = document.getElementById("recipe-steps");
    const errorContainer = document.getElementById("error-messages");

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
            alert("Recipe added successfully! (Backend will be connected later)");
            form.reset();
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
