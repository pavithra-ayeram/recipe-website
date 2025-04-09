// Common functionality for all pages
document.addEventListener("DOMContentLoaded", function() {
    // Check if there's a logout link
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            // Clear the token and redirect to login
            localStorage.removeItem('token');
            window.location.href = "/login";
        });
    }
    
    // Check if user is on a protected page
    const protectedPages = ['/recipes', '/add-recipe', '/add-ingredient'];
    const currentPath = window.location.pathname;
    
    if (protectedPages.includes(currentPath)) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = "/login";
        }
    }
});