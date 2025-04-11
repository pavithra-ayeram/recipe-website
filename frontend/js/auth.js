document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const nameInput = document.getElementById("name"); // Only for signup
    const errorContainer = document.createElement("div");

    errorContainer.classList.add("error-messages");
    form.appendChild(errorContainer);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        errorContainer.innerHTML = "";
        let isValid = true;

        if (nameInput && nameInput.value.trim().length < 3) {
            showError("Name must be at least 3 characters.", nameInput);
            isValid = false;
        } else if (nameInput) {
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

        if (isValid) {
            // Determine if this is a login or signup form
            const isSignup = !!nameInput;
            
            const userData = {
                email: emailInput.value,
                password: passwordInput.value
            };
            
            if (isSignup) {
                userData.username = nameInput.value;
                
                // Call signup API
                fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(data.detail || 'Signup failed');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    alert("Signup successful! Please log in.");
                    window.location.href = "/login";
                })
                .catch(error => {
                    showError(error.message, emailInput);
                });
            } else {
                // Call login API
                fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(data.detail || 'Login failed');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    // Store the token in localStorage
                    localStorage.setItem('token', data.access_token);
                    window.location.href = "/recipes";
                })
                .catch(error => {
                    showError(error.message, emailInput);
                });
            }
        }
    });

    // Live validation
    if (nameInput) {
        nameInput.addEventListener("input", function () {
            validateInput(nameInput, nameInput.value.trim().length >= 3);
        });
    }

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