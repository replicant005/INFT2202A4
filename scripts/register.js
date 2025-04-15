
import { User } from './user.js';
/**
 * Generates HTML for the registration page
 * @returns Promise resolving to HTML string
 */
export const renderRegisterPage = async () => {
    try {
        const response = await fetch("views/content/register.html");
        const html = await response.text();
        return html;
    }
    catch (error) {
        console.error(`[ERROR] Failed to load register page content: ${error}`);
        // Fallback content in case the file can't be loaded
        return `
        <main class="container" id="mainContent">
            <div class="row mt-5">
                <div class="offset-md-3 col-md-6 col-sm-12">
                    <h1 class="display-4">Register</h1>
                    <div class="alert alert-danger">
                        Failed to load registration page content. Please try again later.
                    </div>
                </div>
            </div>
        </main>
        `;
    }
};
/**
 * Initializes registration page functionality
 */
export const initRegisterPage = () => {
    const registerForm = document.getElementById('registerForm');
    const messageArea = document.getElementById('messageArea');
    if (!registerForm || !messageArea) {
        console.error('[ERROR] Required registration page elements not found');
        return;
    }
    // Hide message area initially
    messageArea.classList.add('d-none');
    // Form submission handler
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Validate form
        const errors = validateRegistrationForm();
        if (errors.length > 0) {
            // Display validation errors
            displayValidationErrors(errors);
            return;
        }
        // Form is valid, create user object
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('emailAddress').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const user = new User(`${firstName} ${lastName}`, email, username, password);
        // Simulate user registration
        registerUser(user);
    });
};
/**
 * Validates the registration form
 * @returns Array of validation errors
 */
const validateRegistrationForm = () => {
    const errors = [];
    // Get form fields
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('emailAddress').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    // Validate first name
    if (!firstName) {
        errors.push({ field: 'firstName', message: 'First name is required' });
    }
    // Validate last name
    if (!lastName) {
        errors.push({ field: 'lastName', message: 'Last name is required' });
    }
    // Validate email
    if (!email) {
        errors.push({ field: 'emailAddress', message: 'Email address is required' });
    }
    else if (!isValidEmail(email)) {
        errors.push({ field: 'emailAddress', message: 'Please enter a valid email address' });
    }
    // Validate username
    if (!username) {
        errors.push({ field: 'username', message: 'Username is required' });
    }
    else if (username.length < 3) {
        errors.push({ field: 'username', message: 'Username must be at least 3 characters' });
    }
    // Validate password
    if (!password) {
        errors.push({ field: 'password', message: 'Password is required' });
    }
    else if (password.length < 6) {
        errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    }
    // Validate confirm password
    if (!confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Please confirm your password' });
    }
    else if (password !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }
    return errors;
};
/**
 * Displays validation errors on the form
 * @param errors Array of validation errors
 */
const displayValidationErrors = (errors) => {
    // Clear all previous errors
    const errorElements = document.querySelectorAll('.invalid-feedback');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.classList.remove('is-invalid');
    });
    // Display new errors
    errors.forEach(error => {
        const input = document.getElementById(error.field);
        const errorElement = document.getElementById(`${error.field}Error`);
        if (input && errorElement) {
            input.classList.add('is-invalid');
            errorElement.textContent = error.message;
        }
    });
    // Display general error message if there are errors
    if (errors.length > 0) {
        const messageArea = document.getElementById('messageArea');
        if (messageArea) {
            messageArea.textContent = 'Please fix the errors in the form below.';
            messageArea.classList.remove('d-none', 'alert-success');
            messageArea.classList.add('alert-danger');
        }
    }
};
/**
 * Checks if an email address is valid
 * @param email Email address to validate
 * @returns Boolean indicating if email is valid
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
/**
 * Simulates user registration
 * @param user User object to register
 */
const registerUser = (user) => {
    // In a real application, this would send a request to the server
    console.log('[INFO] Registering user:', user);
    // Simulate successful registration
    setTimeout(() => {
        const messageArea = document.getElementById('messageArea');
        if (messageArea) {
            const existingUsers = localStorage.getItem('registeredUsers');
            const users = existingUsers ? JSON.parse(existingUsers) : [];
            users.push(user.toJSON());
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            messageArea.textContent = `Registration successful! Welcome, ${user.displayName}. You can now login with your credentials.`;
            messageArea.classList.remove('d-none', 'alert-danger');
            messageArea.classList.add('alert-success');
        }
        // Reset the form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.reset();
        }
        // Redirect to login page after a delay
        setTimeout(() => {
            window.location.hash = '/login';
        }, 3000);
    }, 1500);
};
export default { renderRegisterPage, initRegisterPage };
//# sourceMappingURL=register.js.map