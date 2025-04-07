document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    if (!form) {
        console.log("Login form not found");
        return;
    }

    console.log("Login form found");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.access_token);
                window.location.href = "/recipes";
            } else {
                alert(data.detail || "Login failed.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong.");
        }
    });
});
