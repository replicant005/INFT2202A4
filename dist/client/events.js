/**
 * Generates the HTML for the events page
 * @returns Promise resolving to HTML string
 */
export const renderEventsPage = async () => {
    try {
        const response = await fetch("views/content/events.html");
        const html = await response.text();
        return html;
    }
    catch (error) {
        console.error(`[ERROR] Failed to load events page content: ${error}`);
        // Fallback content in case the file can't be loaded
        return `
        <div class="container mt-5">
            <h1>Upcoming Events</h1>
            <div class="alert alert-danger">Failed to load events page content. Please try again later.</div>
        </div>
        `;
    }
};
/**
 * Initializes events page functionality
 */
export const initEventsPage = async () => {
    try {
        // Fetch events data
        const events = await fetchEventsData();
        // Display events
        displayEvents(events);
        // Attach filter event listeners
        attachFilterEventListeners();
    }
    catch (error) {
        console.error('[ERROR] Failed to initialize events page:', error);
        const eventList = document.getElementById('event-list');
        if (eventList) {
            eventList.innerHTML = `
                <div class="alert alert-danger w-100">
                    Failed to load events. Please try again later.
                </div>
            `;
        }
    }
};
/**
 * Fetches events data from the server
 * @returns Promise resolving to array of Event objects
 */
const fetchEventsData = async () => {
    try {
        const response = await fetch('data/events.json');
        if (!response.ok) {
            throw new Error('Failed to load events data');
        }
        return await response.json();
    }
    catch (error) {
        console.error('[ERROR] Unable to fetch events data:', error);
        return [];
    }
};
/**
 * Displays events on the page
 * @param events Array of Event objects to display
 */
const displayEvents = (events) => {
    const eventList = document.getElementById('event-list');
    if (!eventList) {
        console.error('[ERROR] Event list container not found');
        return;
    }
    // Check if there are events to display
    if (events.length === 0) {
        eventList.innerHTML = `
            <div class="alert alert-info w-100">
                No events available at this time.
            </div>
        `;
        return;
    }
    // Generate HTML for each event
    let eventsHTML = '';
    events.forEach(event => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        eventsHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card event-card h-100" data-category="${event.category}">
                    <div class="card-body">
                        <h5 class="card-title event-title">${event.title}</h5>
                        <p class="card-text event-description">${event.description}</p>
                        <p class="event-date"><i class="fas fa-calendar-alt me-2"></i>${formattedDate}</p>
                        <span class="badge ${getCategoryBadgeClass(event.category)}">${event.category}</span>
                    </div>
                </div>
            </div>
        `;
    });
    eventList.innerHTML = eventsHTML;
};
/**
 * Gets the appropriate badge class for a category
 * @param category Event category
 * @returns Bootstrap badge class
 */
const getCategoryBadgeClass = (category) => {
    switch (category.toLowerCase()) {
        case 'fundraiser':
            return 'bg-secondary';
        case 'workshop':
            return 'bg-success';
        case 'cleanup':
            return 'bg-danger';
        default:
            return 'bg-primary';
    }
};
/**
 * Attaches click event listeners to filter buttons
 */
const attachFilterEventListeners = () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Get the category to filter by
            const category = this.getAttribute('data-category');
            // Filter events
            if (category) {
                filterEvents(category);
            }
        });
    });
    // Set 'All' as the default active filter
    const allButton = document.querySelector('.filter-button[data-category="All"]');
    if (allButton) {
        allButton.classList.add('active');
    }
};
/**
 * Filters events based on category
 * @param category Category to filter by ('All' for no filter)
 */
const filterEvents = (category) => {
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const container = card.closest('.col-md-6');
        if (container) {
            container.style.display =
                (category === 'All' || cardCategory === category) ? 'block' : 'none';
        }
    });
};
export default { renderEventsPage, initEventsPage };
//# sourceMappingURL=events.js.map