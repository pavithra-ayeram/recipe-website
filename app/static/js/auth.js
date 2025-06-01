// auth.js - Fixed version to handle login and signup form submissions

document.addEventListener('DOMContentLoaded', function() {
    // Get the current page
    const currentPage = window.location.pathname;
    
    // Handle Login Form
    if (currentPage.includes('/login')) {
        const loginForm = document.querySelector('form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async function(event) {
                event.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Form validation
                if (!email || !password) {
                    showError('Please fill in all fields');
                    return;
                }
                
                try {
                    // FIXED: Ensure this matches your backend route exactly
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            email: email, 
                            password: password 
                        }),
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        // Store the token
                        localStorage.setItem('token', data.access_token);
                        // Redirect to recipes page
                        window.location.href = '/recipes';
                    } else {
                        const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
                        showError(errorData.detail || 'Login failed. Please check your credentials.');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    showError('An error occurred during login. Please try again.');
                }
            });
        }
    }
    
    // Handle Signup Form
    if (currentPage.includes('/signup')) {
        const signupForm = document.querySelector('form');
        
        if (signupForm) {
            signupForm.addEventListener('submit', async function(event) {
                event.preventDefault();
                
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password')?.value;
                
                // Form validation
                if (!username || !email || !password) {
                    showError('Please fill in all required fields');
                    return;
                }
                
                if (confirmPassword && password !== confirmPassword) {
                    showError('Passwords do not match');
                    return;
                }
                
                try {
                    // FIXED: Ensure this matches your backend route exactly
                    const response = await fetch('/api/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            username: username, 
                            email: email, 
                            password: password 
                        }),
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        // Show success message and redirect to login
                        alert('Registration successful! Please log in.');
                        window.location.href = '/login';
                    } else {
                        const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
                        showError(errorData.detail || 'Registration failed. Please try again.');
                    }
                } catch (error) {
                    console.error('Signup error:', error);
                    showError('An error occurred during signup. Please try again.');
                }
            });
        }
    }
    
    // Helper function to show error messages
    function showError(message) {
        const errorContainer = document.querySelector('.error-messages');
        if (errorContainer) {
            errorContainer.innerHTML = `<div class="error-text">${message}</div>`;
            errorContainer.style.display = 'block';
        } else {
            alert(message);
        }
    }
});