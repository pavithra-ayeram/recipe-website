document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("recipe-form");
    const ingredName = document.getElementById("ingred-name");
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
            setValid(recipeName);
        }

        if (category.value.trim() === "") {
            showError("Ingredient name is required.", category);
            isValid = false;
        } else {
            setValid(category);
        }



        if (isValid) {
            alert("Ingredient added successfully! (Backend will be connected later)");
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