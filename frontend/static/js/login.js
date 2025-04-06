document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.access_token);
                window.location.href = "/recipes";  // or your dashboard page
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Login failed. Check your credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong. Please try again later.");
        }
    });
});
