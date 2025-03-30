document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorContainer = document.createElement("div");

    errorContainer.classList.add("error-messages");
    form.appendChild(errorContainer);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        errorContainer.innerHTML = "";
        let isValid = true;

        if (!validateEmail(emailInput.value)) {
            showError("Please enter a valid email address.", emailInput);
            isValid = false;
        } else {
            setValid(emailInput);
        }

        if (passwordInput.value.length < 6) {
            showError("Password must be at least 6 characters.", passwordInput);
            isValid = false;
        } else {
            setValid(passwordInput);
        }

        if (isValid) {
            form.submit();
        }
    });

    emailInput.addEventListener("input", function () {
        validateInput(emailInput, validateEmail(emailInput.value));
    });

    passwordInput.addEventListener("input", function () {
        validateInput(passwordInput, passwordInput.value.length >= 6);
    });

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validateInput(input, condition) {
        if (condition) {
            setValid(input);
        } else {
            setInvalid(input);
        }
    }

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
