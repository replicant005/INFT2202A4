/**
 * Generates the HTML for the about page
 * @returns Promise resolving to HTML string
 */
export const renderAboutPage = async () => {
    try {
        const response = await fetch("views/content/about.html");
        const html = await response.text();
        return html;
    }
    catch (error) {
        console.error(`[ERROR] Failed to load about page content: ${error}`);
        // Fallback content in case the file can't be loaded
        return `
        <main class="container mt-4">
            <h1>About Volunteer Connect</h1>
            <p>There was an error loading the about page content. Please try again later.</p>
        </main>
        `;
    }
};
/**
 * Initializes about page functionality
 */
export const initAboutPage = () => {
    // Show or hide the "Back to Home" button based on scroll position
    const backToHomeButton = document.getElementById("backToHome");
    if (backToHomeButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToHomeButton.style.display = "block";
            }
            else {
                backToHomeButton.style.display = "none";
            }
        });
    }
};
export default { renderAboutPage, initAboutPage };
//# sourceMappingURL=about.js.map