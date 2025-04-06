document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signup-form");
    if (!form) return;

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const nameInput = document.getElementById("name");
    const errorContainer = document.createElement("div");

    errorContainer.classList.add("error-messages");
    form.appendChild(errorContainer);

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        errorContainer.innerHTML = "";
        let isValid = true;

        if (nameInput.value.trim().length < 3) {
            showError("Name must be at least 3 characters.", nameInput);
            isValid = false;
        } else {
            setValid(nameInput);
        }

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

        if (!isValid) return;

        // 🔗 Send data to FastAPI backend
        try {
            const res = await fetch("http://127.0.0.1:8000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value,
                    username: nameInput.value
                }),
            });

            if (res.ok) {
                alert("Signup successful! You can now log in.");
                window.location.href = "login.html";
            } else {
                const data = await res.json();
                showError(data.detail || "Signup failed", emailInput);
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Something went wrong.");
        }
    });

    // Validation functions
    nameInput.addEventListener("input", () => validateInput(nameInput, nameInput.value.trim().length >= 3));
    emailInput.addEventListener("input", () => validateInput(emailInput, validateEmail(emailInput.value)));
    passwordInput.addEventListener("input", () => validateInput(passwordInput, passwordInput.value.length >= 6));

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validateInput(input, condition) {
        if (condition) setValid(input);
        else setInvalid(input);
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
