
/**
 * Generates HTML for the privacy policy page
 * @returns Promise resolving to HTML string
 */
export const renderPrivacyPolicyPage = async () => {
    try {
        const response = await fetch("views/content/privacy-policy.html");
        const html = await response.text();
        return html;
    }
    catch (error) {
        console.error(`[ERROR] Failed to load privacy policy page content: ${error}`);
        // Fallback content in case the file can't be loaded
        return `
        <main class="container mt-4">
            <h1>Privacy Policy</h1>
            <div class="alert alert-danger">
                Failed to load privacy policy content. Please try again later.
            </div>
        </main>
        `;
    }
};
/**
 * Initializes privacy policy page functionality
 */
export const initPrivacyPolicyPage = () => {
    // Initialize back to top button
    const backToTopButton = document.getElementById("backToTop");
    if (backToTopButton) {
        // Show or hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.style.display = "block";
            }
            else {
                backToTopButton.style.display = "none";
            }
        });
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};
export default { renderPrivacyPolicyPage, initPrivacyPolicyPage };
//# sourceMappingURL=privacy-policy.js.map