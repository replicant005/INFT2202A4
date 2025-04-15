
import { User } from './user.js';
/**
 * Authentication service for handling login, logout, and user session management
 */
export class AuthenticationService {
    /**
     * Authenticates a user against the JSON data file
     * @param username Username to validate
     * @param password Password to validate
     * @returns Promise resolving to User object if authenticated, or null if not
     */
    static async authenticate(username, password) {
        try {
            console.log("Attempting to authenticate user:", username);
            // First check localStorage for registered users (for testing purposes)
            const registeredUsersJson = localStorage.getItem('registeredUsers');
            if (registeredUsersJson) {
                const registeredUsers = JSON.parse(registeredUsersJson);
                console.log("Registered users found:", registeredUsers);
                const matchedUser = registeredUsers.find((user) => user.Username === username && user.Password === password);
                if (matchedUser) {
                    console.log("User authenticated from localStorage:", matchedUser);
                    const user = new User();
                    user.fromJSON(matchedUser);
                    return user;
                }
            }
            // Continue with your existing code to check users.json
            const response = await fetch("data/users.json");
            if (!response.ok) {
                throw new Error(`[ERROR] HTTP error! ${response.status}`);
            }
            const jsonData = await response.json();
            const users = jsonData.users;
            if (!Array.isArray(users)) {
                throw new Error("[ERROR] JSON data does not contain a valid array");
            }
            console.log("Users from JSON file:", users);
            const authenticatedUser = users.find(user => user.Username === username && user.Password === password);
            if (authenticatedUser) {
                console.log("User authenticated from JSON:", authenticatedUser);
                const user = new User();
                user.fromJSON(authenticatedUser);
                return user;
            }
            console.log("Authentication failed - no matching user found");
            return null;
        }
        catch (error) {
            console.error("[ERROR] Authentication failed:", error);
            return null;
        }
    }
    /**
     * Logs in a user and stores their session
     * @param user User object to store in session
     */
    static login(user) {
        // Store user data in session storage (excluding password)
        const userData = {
            DisplayName: user.displayName,
            EmailAddress: user.emailAddress,
            Username: user.userName
        };
        sessionStorage.setItem("user", JSON.stringify(userData));
        // Dispatch a custom event to notify of login
        const loginEvent = new CustomEvent("userLogin", {
            detail: { user: userData }
        });
        document.dispatchEvent(loginEvent);
    }
    /**
     * Logs out the current user
     */
    static logout() {
        // Remove user data from session storage
        sessionStorage.removeItem("user");
        // Dispatch a custom event to notify of logout
        const logoutEvent = new CustomEvent("userLogout");
        document.dispatchEvent(logoutEvent);
        // Redirect to home page
        window.location.hash = "/home";
    }
    /**
     * Checks if a user is currently logged in
     * @returns True if user is logged in, false otherwise
     */
    static isLoggedIn() {
        return !!sessionStorage.getItem("user");
    }
    /**
     * Gets the currently logged in user
     * @returns User object if logged in, null otherwise
     */
    static getCurrentUser() {
        const userData = sessionStorage.getItem("user");
        if (!userData) {
            return null;
        }
        try {
            const parsedUser = JSON.parse(userData);
            const user = new User();
            user.fromJSON(parsedUser);
            return user;
        }
        catch (error) {
            console.error("[ERROR] Failed to parse user data:", error);
            return null;
        }
    }
}
export default AuthenticationService;
//# sourceMappingURL=authentication.js.map