
/**
 * Generates the HTML for the contact page
 * @returns Promise resolving to HTML string
 */
export const renderContactPage = async () => {
    try {
        const response = await fetch("views/content/contact.html");
        const html = await response.text();
        return html;
    }
    catch (error) {
        console.error(`[ERROR] Failed to load contact page content: ${error}`);
        // Fallback content in case the file can't be loaded
        return `
        <main class="container">
            <h1>Feedback</h1>
            <p>There was an error loading the contact page. Please try again later.</p>
        </main>
        `;
    }
};
/**
 * Initializes contact page functionality
 */
export const initContactPage = () => {
    setupFeedbackFormListener();
};
/**
 * Sets up the feedback form submission listener
 */
const setupFeedbackFormListener = () => {
    const feedbackForm = document.getElementById('feedbackForm');
    if (!feedbackForm) {
        console.error('[ERROR] Feedback form not found');
        return;
    }
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Get form data
        const formData = {
            name: document.getElementById('feedbackName').value,
            email: document.getElementById('feedbackEmail').value,
            rating: document.getElementById('rating').value,
            comments: document.getElementById('comments').value
        };
        // Simulate AJAX request (Replace with actual API call if needed)
        submitFeedback(formData);
    });
};
/**
 * Submits feedback data (simulated)
 * @param formData Feedback form data
 */
const submitFeedback = (formData) => {
    // Simulate AJAX delay
    setTimeout(() => {
        const modalBody = document.getElementById('confirmationModalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <h5>Feedback Submitted Successfully!</h5>
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Rating:</strong> ${formData.rating} Stars</p>
                <p><strong>Comments:</strong> ${formData.comments}</p>
            `;
            // Show the modal using Bootstrap
            // @ts-ignore - Bootstrap is loaded globally
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            confirmationModal.show();
            // Reset the form
            const feedbackForm = document.getElementById('feedbackForm');
            if (feedbackForm) {
                feedbackForm.reset();
            }
        }
    }, 1000);
};
export default { renderContactPage, initContactPage };
//# sourceMappingURL=contact.js.map