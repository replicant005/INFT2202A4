
import AuthenticationService from './authentication.js';
/**
 * Generates HTML for the login page
 * @returns Promise resolving to HTML string
 */
export const renderLoginPage = async () => {
    try {
        const response = await fetch("views/content/login.html");
        const html = await response.text();
        return html;
    }
    catch (error) {
        console.error(`[ERROR] Failed to load login page content: ${error}`);
        // Fallback content in case the file can't be loaded
        return `
        <main class="container">
            <div class="row mt-5">
                <div class="col-md-6 offset-md-3">
                    <h1 class="display-4">Login</h1>
                    <div class="alert alert-danger">
                        Failed to load login page content. Please try again later.
                    </div>
                </div>
            </div>
        </main>
        `;
    }
};
/**
 * Initializes login page functionality
 */
export const initLoginPage = () => {
    // Get references to elements
    const loginButton = document.getElementById('loginButton');
    const cancelButton = document.getElementById('cancelButton');
    const messageArea = document.getElementById('messageArea');
    if (!loginButton || !cancelButton || !messageArea) {
        console.error('[ERROR] Required login page elements not found');
        return;
    }
    // Hide message area initially
    messageArea.classList.add('d-none');
    // Login button event listener
    loginButton.addEventListener('click', async (event) => {
        event.preventDefault();
        // Get form values
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (!username || !password) {
            displayErrorMessage(messageArea, 'Please enter both username and password.');
            return;
        }
        // Attempt to authenticate
        const user = await AuthenticationService.authenticate(username, password);
        if (user) {
            // User authenticated successfully
            displaySuccessMessage(messageArea, `Welcome, ${user.displayName}! Redirecting to home page...`);
            // Store user in session
            AuthenticationService.login(user);
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.hash = '/home';
            }, 2000);
        }
        else {
            // Authentication failed
            displayErrorMessage(messageArea, 'Invalid username or password. Please try again.');
            // Focus on username field
            usernameInput.focus();
            usernameInput.select();
        }
    });
    // Cancel button event listener
    cancelButton.addEventListener('click', (event) => {
        event.preventDefault();
        // Reset form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
        // Redirect to home page
        window.location.hash = '/home';
    });
};
/**
 * Displays an error message
 * @param messageArea Element to display message in
 * @param message Message to display
 */
const displayErrorMessage = (messageArea, message) => {
    messageArea.textContent = message;
    messageArea.classList.remove('d-none', 'alert-success');
    messageArea.classList.add('alert-danger');
};
/**
 * Displays a success message
 * @param messageArea Element to display message in
 * @param message Message to display
 */
const displaySuccessMessage = (messageArea, message) => {
    messageArea.textContent = message;
    messageArea.classList.remove('d-none', 'alert-danger');
    messageArea.classList.add('alert-success');
};
export default { renderLoginPage, initLoginPage };
//# sourceMappingURL=login.js.map