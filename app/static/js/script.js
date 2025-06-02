document.addEventListener("DOMContentLoaded", function() {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();

            localStorage.removeItem('token');
            window.location.href = "/login";
        });
    }
    
    const protectedPages = ['/recipes', '/add-recipe', '/add-ingredient'];
    const currentPath = window.location.pathname;
    
    if (protectedPages.includes(currentPath)) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = "/login";
        }
    }
});