export class Router {
    /**
     * Creates a new Router instance
     * @param routes Array of route objects
     */
    constructor(routes) {
        this.routes = routes;
        this.mainContentElement = document.getElementById('mainContent');
        this.initializeRouter();
    }
    /**
     * Initializes the router by setting up event listeners
     */
    initializeRouter() {
        // Handle navigation
        window.addEventListener('hashchange', this.routeChanged.bind(this));
        // Initial route
        this.routeChanged();
        // Update active navigation links when route changes
        document.addEventListener('click', (e) => {
            const target = e.target;
            const navLink = target.closest('a[href^="#/"]');
            if (navLink) {
                e.preventDefault();
                const path = navLink.getAttribute('href');
                if (path) {
                    window.location.hash = path.substring(1); // Remove the '#' prefix
                }
            }
        });
    }
    /**
     * Handles route changes when hash changes
     */
    async routeChanged() {
        // Get the current path from the URL hash
        const path = window.location.hash.substring(1) || '/';
        // Find matching route
        const route = this.getRoute(path);
        // Check if route requires authentication
        if (route.auth && !this.isAuthenticated()) {
            // User needs to be logged in to access this route - redirect to login
            window.location.hash = '/login';
            return;
        }
        // Update page title
        document.title = `${route.title} - Volunteer Connect`;
        // Render the view
        if (this.mainContentElement) {
            try {
                const html = await route.view();
                this.mainContentElement.innerHTML = html;
                this.updateActiveNavLinks();
                window.scrollTo(0, 0);
                // Dispatch a custom event after the page is loaded
                // This will trigger the initialization functions
                const pageLoadedEvent = new CustomEvent('pageLoaded', {
                    detail: { path: path }
                });
                document.dispatchEvent(pageLoadedEvent);
            }
            catch (error) {
                console.error('[ERROR] Failed to render view:', error);
                this.mainContentElement.innerHTML = '<div class="container mt-5"><div class="alert alert-danger">Failed to load page content</div></div>';
            }
        }
    }
    /**
     * Gets the corresponding route from a path, or defaults to home/404
     * @param path URL path
     * @returns Route object
     */
    getRoute(path) {
        // Find the matching route
        const matchedRoute = this.routes.find(route => route.path === path);
        if (matchedRoute) {
            return matchedRoute;
        }
        // If we're at exactly '/', show the home page
        if (path === '/') {
            const homeRoute = this.routes.find(route => route.path === '/home');
            return homeRoute || this.routes[0]; // Fallback to first route
        }
        // Return a 404 route or default to home
        const notFoundRoute = this.routes.find(route => route.path === '/404');
        return notFoundRoute || this.routes[0];
    }
    /**
     * Checks if a user is currently authenticated
     * @returns Boolean indicating if user is authenticated
     */
    isAuthenticated() {
        const user = sessionStorage.getItem('user');
        return !!user;
    }
    /**
     * Updates the active state of navigation links based on current route
     */
    updateActiveNavLinks() {
        const currentPath = window.location.hash.substring(1) || '/';
        // Get all navigation links with hash-based routing
        const navLinks = document.querySelectorAll('a[href^="#/"]');
        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href) {
                const path = href.substring(1); // Remove the '#' prefix
                // Check if this link matches the current path
                if (path === currentPath) {
                    link.classList.add('active');
                    // Also mark the parent li as active if it exists
                    const parentLi = link.closest('li');
                    if (parentLi) {
                        parentLi.classList.add('active');
                    }
                }
                else {
                    link.classList.remove('active');
                    // Remove active from parent li
                    const parentLi = link.closest('li');
                    if (parentLi) {
                        parentLi.classList.remove('active');
                    }
                }
            }
        });
    }
}
export default Router;
//# sourceMappingURL=router.js.map