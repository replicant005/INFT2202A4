
import Router from './router.js';
import { LoadHeader } from './header.js';
import { LoadFooter } from './footer.js';
import AuthenticationService from './authentication.js';
// Import all page view modules
import HomeView from './home.js';
import AboutView from './about.js';
import ContactView from './contact.js';
import EventsView from './events.js';
import OpportunitiesView from './opportunities.js';
import GalleryView from './gallery.js';
import NewsView from './news.js';
import LoginView from './login.js';
import RegisterView from './register.js';
import StatisticsView from './statistics.js';
import EventPlanningView from './event-planning.js';
import PrivacyPolicyView from './privacy-policy.js';
import TermsOfServiceView from './terms-of-service.js';
/**
 * Initializes the application when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log("[INFO] Volunteer Connect SPA initializing...");
    // Initialize the header
    const headerElement = document.getElementById('mainHeader');
    if (headerElement) {
        await LoadHeader();
    }
    await LoadFooter();
    // Initialize Back to Top button functionality
    initBackToTop();
    // Set up authentication event listeners
    setupAuthListeners();
    // Define routes
    const router = new Router([
        {
            path: '/',
            view: HomeView.renderHomePage,
            title: 'Home'
        },
        {
            path: '/home',
            view: HomeView.renderHomePage,
            title: 'Home'
        },
        {
            path: '/about',
            view: AboutView.renderAboutPage,
            title: 'About'
        },
        {
            path: '/contact',
            view: ContactView.renderContactPage,
            title: 'Contact Us'
        },
        {
            path: '/events',
            view: EventsView.renderEventsPage,
            title: 'Events'
        },
        {
            path: '/opportunities',
            view: OpportunitiesView.renderOpportunitiesPage,
            title: 'Volunteer Opportunities'
        },
        {
            path: '/gallery',
            view: GalleryView.renderGalleryPage,
            title: 'Gallery'
        },
        {
            path: '/news',
            view: NewsView.renderNewsPage,
            title: 'Community News'
        },
        {
            path: '/login',
            view: LoginView.renderLoginPage,
            title: 'Login'
        },
        {
            path: '/register',
            view: RegisterView.renderRegisterPage,
            title: 'Register'
        },
        {
            path: '/statistics',
            view: StatisticsView.renderStatisticsPage,
            title: 'Statistics',
            auth: true // Requires authentication
        },
        {
            path: '/event-planning',
            view: EventPlanningView.renderEventPlanningPage,
            title: 'Event Planning',
            auth: true // Requires authentication
        },
        {
            path: '/privacy-policy',
            view: PrivacyPolicyView.renderPrivacyPolicyPage,
            title: 'Privacy Policy'
        },
        {
            path: '/terms-of-service',
            view: TermsOfServiceView.renderTermsOfServicePage,
            title: 'Terms of Service'
        },
        {
            path: '/404',
            view: async () => `
                <div class="container mt-5 text-center">
                    <h1>404 - Page Not Found</h1>
                    <p class="lead">The page you're looking for doesn't exist.</p>
                    <a href="#/home" class="btn btn-primary">Go Home</a>
                </div>
            `,
            title: 'Page Not Found'
        }
    ]);
    // Custom event listener for after page content is loaded
    document.addEventListener('pageLoaded', (e) => {
        const path = e.detail.path;
        console.log("Page loaded event triggered with path:", path);
        // Initialize specific page functionality based on current path
        // Remove the leading slash for comparison
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        switch (normalizedPath) {
            case '/home':
                HomeView.initHomePage();
                break;
            case '/about':
                AboutView.initAboutPage();
                break;
            case '/contact':
                ContactView.initContactPage();
                break;
            case '/events':
                EventsView.initEventsPage();
                break;
            case '/opportunities':
                OpportunitiesView.initOpportunitiesPage();
                break;
            case '/gallery':
                GalleryView.initGalleryPage();
                break;
            case '/news':
                NewsView.initNewsPage();
                break;
            case '/login':
                LoginView.initLoginPage();
                break;
            case '/register':
                RegisterView.initRegisterPage();
                break;
            case '/statistics':
                StatisticsView.initStatisticsPage();
                break;
            case '/event-planning':
                EventPlanningView.initEventPlanningPage();
                break;
            default:
                // No specific initialization needed
                break;
        }
    });
});
/**
 * Sets up authentication event listeners
 */
function setupAuthListeners() {
    // Listen for login events
    document.addEventListener('userLogin', async (e) => {
        console.log('[INFO] User logged in:', e.detail.user);
        // Update the header to reflect the logged-in state
        const headerElement = document.getElementById('mainHeader');
        if (headerElement) {
            await LoadHeader();
        }
    });
    // Listen for logout events
    document.addEventListener('userLogout', async () => {
        console.log('[INFO] User logged out');
        // Update the header to reflect the logged-out state
        const headerElement = document.getElementById('mainHeader');
        if (headerElement) {
            await LoadHeader();
        }
    });
}
/**
 * Initializes the Back to Top button functionality
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) {
        console.error('[ERROR] Back to Top button not found');
        return;
    }
    // Show or hide the button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        }
        else {
            backToTopButton.style.display = 'none';
        }
    });
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
// Expose core functionality to the global scope for debugging
window.app = {
    auth: AuthenticationService
};
//# sourceMappingURL=app.js.map