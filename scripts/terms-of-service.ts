

/**
 * Generates HTML for the terms of service page
 * @returns Promise resolving to HTML string
 */
export const renderTermsOfServicePage = async (): Promise<string> => {
    try {
        const response = await fetch("views/content/terms-of-service.html");
        const html = await response.text();
        return html;
    } catch (error) {
        console.error(`[ERROR] Failed to load terms of service page content: ${error}`);
        
        // Fallback content in case the file can't be loaded
        return `
        <main class="container mt-4">
            <h1>Terms of Service</h1>
            <div class="alert alert-danger">
                Failed to load terms of service content. Please try again later.
            </div>
        </main>
        `;
    }
};

/**
 * Initializes terms of service page functionality
 */
export const initTermsOfServicePage = (): void => {
    // Initialize back to top button
    const backToHomeButton = document.getElementById("backToHome");
    if (backToHomeButton) {
        // Show or hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToHomeButton.style.display = "block";
            } else {
                backToHomeButton.style.display = "none";
            }
        });
        // Scroll to top when clicked
        backToHomeButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

export default { renderTermsOfServicePage, initTermsOfServicePage };