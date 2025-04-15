
/**
 * Generates HTML for the volunteer opportunities page
 * @returns Promise resolving to HTML string
 */
export const renderOpportunitiesPage = async () => {
    try {
        const response = await fetch("views/content/opportunities.html");
        const html = await response.text();
        return html;
    }
    catch (error) {
        console.error(`[ERROR] Failed to load opportunities page content: ${error}`);
        // Fallback content in case the file can't be loaded
        return `
        <section class="container py-5">
            <h2 class="text-center mb-4">Volunteer Opportunities</h2>
            <div class="alert alert-danger">
                Failed to load opportunities page content. Please try again later.
            </div>
        </section>
        `;
    }
};
/**
 * Initializes volunteer opportunities page functionality
 */
export const initOpportunitiesPage = async () => {
    try {
        // Load volunteer opportunities
        const opportunities = await getOpportunities();
        displayOpportunities(opportunities);
        // Set up form submission handler
        setupSignupFormHandler();
    }
    catch (error) {
        console.error('[ERROR] Failed to initialize opportunities page:', error);
        const opportunityCards = document.getElementById('opportunity-cards');
        if (opportunityCards) {
            opportunityCards.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Failed to load volunteer opportunities. Please try again later.
                    </div>
                </div>
            `;
        }
    }
};
/**
 * Gets volunteer opportunities data
 * @returns Promise resolving to array of VolunteerOpportunity objects
 */
const getOpportunities = async () => {
    // In a real application, this would fetch data from an API
    // For this example, we'll return static data
    return [
        {
            title: "Beach Cleanup",
            description: "Help clean up the local beach and protect marine life. Join our team for a day of environmental action.",
            dateTime: "2025-04-05 09:00",
            location: "Lakeview Beach",
            organization: "EcoProtect"
        },
        {
            title: "Food Bank Donation",
            description: "Assist in organizing and packing food donations for families in need. Your time can help feed dozens of families!",
            dateTime: "2025-04-06 10:00",
            location: "Community Center",
            organization: "Food for All"
        },
        {
            title: "Tree Planting",
            description: "Join us to plant trees and contribute to environmental conservation. Help make our community greener!",
            dateTime: "2025-04-07 08:30",
            location: "Riverside Park",
            organization: "Green Tomorrow"
        },
        {
            title: "Senior Center Visit",
            description: "Spend time with seniors at the local care center. Activities include reading, games, and conversation.",
            dateTime: "2025-04-10 14:00",
            location: "Golden Years Care Center",
            organization: "Community Outreach"
        },
        {
            title: "After-School Tutoring",
            description: "Help elementary students with homework and learning activities. Make a difference in a child's education!",
            dateTime: "2025-04-12 15:30",
            location: "Riverside Elementary School",
            organization: "Education First"
        },
        {
            title: "Animal Shelter Support",
            description: "Help care for animals at the local shelter. Tasks include walking dogs, socializing cats, and basic care.",
            dateTime: "2025-04-15 09:00",
            location: "Happy Paws Animal Shelter",
            organization: "Animal Rescue Network"
        }
    ];
};
/**
 * Displays volunteer opportunities on the page
 * @param opportunities Array of VolunteerOpportunity objects
 */
const displayOpportunities = (opportunities) => {
    const opportunityCards = document.getElementById('opportunity-cards');
    if (!opportunityCards) {
        console.error('[ERROR] Opportunity cards container not found');
        return;
    }
    // Check if there are opportunities to display
    if (opportunities.length === 0) {
        opportunityCards.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No volunteer opportunities available at this time. Please check back later.
                </div>
            </div>
        `;
        return;
    }
    // Generate HTML for each opportunity
    let cardsHTML = '';
    opportunities.forEach((opportunity, index) => {
        // Format date and time for display
        const dateTime = new Date(opportunity.dateTime);
        const formattedDate = dateTime.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = dateTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        cardsHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${opportunity.title}</h5>
                        <p class="card-text">${opportunity.description}</p>
                        <p class="card-text">
                            <strong><i class="fas fa-calendar-alt me-2"></i>Date & Time:</strong> 
                            ${formattedDate} at ${formattedTime}
                        </p>
                        ${opportunity.location ? `
                        <p class="card-text">
                            <strong><i class="fas fa-map-marker-alt me-2"></i>Location:</strong> 
                            ${opportunity.location}
                        </p>
                        ` : ''}
                        ${opportunity.organization ? `
                        <p class="card-text">
                            <strong><i class="fas fa-building me-2"></i>Organization:</strong> 
                            ${opportunity.organization}
                        </p>
                        ` : ''}
                        <button class="btn btn-primary sign-up-btn" data-bs-toggle="modal" data-bs-target="#signupModal" data-opportunity-index="${index}">
                            <i class="fas fa-hand-paper me-2"></i>Sign Up
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    opportunityCards.innerHTML = cardsHTML;
    // Add event listeners to sign up buttons
    document.querySelectorAll('.sign-up-btn').forEach((button) => {
        button.addEventListener('click', handleSignupClick);
    });
};
/**
 * Handles clicking on a sign up button
 * @param e Click event
 */
const handleSignupClick = (e) => {
    var _a, _b;
    const button = e.currentTarget;
    const opportunityIndex = button.getAttribute('data-opportunity-index');
    if (opportunityIndex) {
        // Store the selected opportunity index in the form for later use
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.setAttribute('data-opportunity-index', opportunityIndex);
        }
        // Update modal title with the opportunity name
        const modalTitle = document.getElementById('signupModalLabel');
        if (modalTitle) {
            const opportunityTitle = (_b = (_a = button.closest('.card')) === null || _a === void 0 ? void 0 : _a.querySelector('.card-title')) === null || _b === void 0 ? void 0 : _b.textContent;
            modalTitle.textContent = `Sign Up for ${opportunityTitle || 'Opportunity'}`;
        }
        // Reset the form and hide any previous confirmation message
        const confirmationMessage = document.getElementById('confirmationMessage');
        if (confirmationMessage) {
            confirmationMessage.style.display = 'none';
        }
        signupForm === null || signupForm === void 0 ? void 0 : signupForm.reset();
    }
};
/**
 * Sets up the signup form submission handler
 */
const setupSignupFormHandler = () => {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) {
        console.error('[ERROR] Signup form not found');
        return;
    }
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Validate form
        if (!validateSignupForm()) {
            return;
        }
        // Form is valid, show confirmation message
        const confirmationMessage = document.getElementById('confirmationMessage');
        if (confirmationMessage) {
            confirmationMessage.style.display = 'block';
        }
        // Hide the form
        signupForm.style.display = 'none';
        // Close the modal after a delay
        setTimeout(() => {
            // Reset and show the form for next time
            signupForm.reset();
            signupForm.style.display = 'block';
            // Hide the confirmation message
            if (confirmationMessage) {
                confirmationMessage.style.display = 'none';
            }
            // Hide the modal
            // @ts-ignore - Bootstrap is loaded globally
            const modal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
            modal === null || modal === void 0 ? void 0 : modal.hide();
        }, 3000);
    });
};
/**
 * Validates the signup form
 * @returns Boolean indicating if form is valid
 */
const validateSignupForm = () => {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const roleInput = document.getElementById('role');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const roleError = document.getElementById('roleError');
    let isValid = true;
    // Reset previous error states
    nameInput.classList.remove('is-invalid');
    emailInput.classList.remove('is-invalid');
    roleInput.classList.remove('is-invalid');
    if (nameError)
        nameError.textContent = '';
    if (emailError)
        emailError.textContent = '';
    if (roleError)
        roleError.textContent = '';
    // Validate name
    if (!nameInput.value.trim()) {
        nameInput.classList.add('is-invalid');
        if (nameError)
            nameError.textContent = 'Name is required';
        isValid = false;
    }
    // Validate email
    if (!emailInput.value.trim()) {
        emailInput.classList.add('is-invalid');
        if (emailError)
            emailError.textContent = 'Email is required';
        isValid = false;
    }
    else if (!isValidEmail(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        if (emailError)
            emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    // Validate role
    if (!roleInput.value.trim()) {
        roleInput.classList.add('is-invalid');
        if (roleError)
            roleError.textContent = 'Preferred role is required';
        isValid = false;
    }
    return isValid;
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
export default { renderOpportunitiesPage, initOpportunitiesPage };
//# sourceMappingURL=opportunities.js.map