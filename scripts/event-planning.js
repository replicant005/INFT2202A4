
/**
 * Generates HTML for the event planning page
 * @returns Promise resolving to HTML string
 */
export const renderEventPlanningPage = async () => {
    return `
    <div class="container py-5">
        <h1 class="text-center mb-5">Event Planning</h1>
        
        <div class="row">
            <div class="col-lg-4 mb-4">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h2 class="h4 mb-0">Create New Event</h2>
                    </div>
                    <div class="card-body">
                        <form id="eventForm">
                            <div class="mb-3">
                                <label for="eventName" class="form-label">Event Name</label>
                                <input type="text" class="form-control" id="eventName" required>
                                <div class="invalid-feedback" id="eventNameError"></div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="eventDate" class="form-label">Date</label>
                                <input type="date" class="form-control" id="eventDate" required>
                                <div class="invalid-feedback" id="eventDateError"></div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="eventTime" class="form-label">Time</label>
                                <input type="time" class="form-control" id="eventTime" required>
                                <div class="invalid-feedback" id="eventTimeError"></div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="eventLocation" class="form-label">Location</label>
                                <input type="text" class="form-control" id="eventLocation" required>
                                <div class="invalid-feedback" id="eventLocationError"></div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="eventDescription" class="form-label">Description</label>
                                <textarea class="form-control" id="eventDescription" rows="3" required></textarea>
                                <div class="invalid-feedback" id="eventDescriptionError"></div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary">Create Event</button>
                            <button type="reset" class="btn btn-secondary">Reset</button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-8">
                <div class="card shadow">
                    <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                        <h2 class="h4 mb-0">Planned Events</h2>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="myEventsOnly">
                            <label class="form-check-label text-white" for="myEventsOnly">Show only my events</label>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Event Name</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Location</th>
                                        <th>Organizer</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="plannedEventsTableBody">
                                    <!-- Table rows will be populated dynamically -->
                                </tbody>
                            </table>
                        </div>
                        <div id="noEventsMessage" class="alert alert-info d-none">
                            No events have been planned yet. Create an event to get started.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Event Details Modal -->
    <div class="modal fade" id="eventDetailsModal" tabindex="-1" aria-labelledby="eventDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="eventDetailsTitle">Event Details</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="eventDetailsBody">
                    <!-- Event details will be populated dynamically -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteEventModal" tabindex="-1" aria-labelledby="deleteEventModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="deleteEventModalLabel">Confirm Delete</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this event? This action cannot be undone.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteButton">Delete</button>
                </div>
            </div>
        </div>
    </div>
    `;
};
/**
 * Initializes event planning page functionality
 */
export const initEventPlanningPage = () => {
    // Load existing events
    loadPlannedEvents();
    // Set up event listeners
    setupEventFormListener();
    setupFilterListener();
};
/**
 * Load planned events from local storage
 */
const loadPlannedEvents = () => {
    const plannedEvents = getPlannedEvents();
    const tableBody = document.getElementById('plannedEventsTableBody');
    const noEventsMessage = document.getElementById('noEventsMessage');
    if (!tableBody || !noEventsMessage) {
        console.error('[ERROR] Events table body or message element not found');
        return;
    }
    // Check if there are any events
    if (plannedEvents.length === 0) {
        tableBody.innerHTML = '';
        noEventsMessage.classList.remove('d-none');
        return;
    }
    // We have events, hide the message
    noEventsMessage.classList.add('d-none');
    // Populate the table
    let tableHtml = '';
    const currentUser = getCurrentUserName();
    plannedEvents.forEach(event => {
        tableHtml += `
            <tr data-event-id="${event.id}">
                <td>${event.name}</td>
                <td>${formatDate(event.date)}</td>
                <td>${event.time}</td>
                <td>${event.location}</td>
                <td>${event.organizer}</td>
                <td>
                    <button class="btn btn-sm btn-info view-event" data-event-id="${event.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${event.organizer === currentUser ? `
                    <button class="btn btn-sm btn-danger delete-event" data-event-id="${event.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = tableHtml;
    // Add event listeners to view and delete buttons
    document.querySelectorAll('.view-event').forEach(button => {
        button.addEventListener('click', handleViewEvent);
    });
    document.querySelectorAll('.delete-event').forEach(button => {
        button.addEventListener('click', handleDeleteEvent);
    });
};
/**
 * Sets up event form submission listener
 */
const setupEventFormListener = () => {
    const eventForm = document.getElementById('eventForm');
    if (!eventForm) {
        console.error('[ERROR] Event form not found');
        return;
    }
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Validate form
        const errors = validateEventForm();
        if (errors.length > 0) {
            // Display validation errors
            displayValidationErrors(errors);
            return;
        }
        // Get form values
        const nameInput = document.getElementById('eventName');
        const dateInput = document.getElementById('eventDate');
        const timeInput = document.getElementById('eventTime');
        const locationInput = document.getElementById('eventLocation');
        const descriptionInput = document.getElementById('eventDescription');
        // Create event object
        const newEvent = {
            id: generateEventId(),
            name: nameInput.value,
            date: dateInput.value,
            time: timeInput.value,
            location: locationInput.value,
            description: descriptionInput.value,
            organizer: getCurrentUserName()
        };
        // Save event
        saveEvent(newEvent);
        // Reset form
        eventForm.reset();
        // Reload events list
        loadPlannedEvents();
    });
};
/**
 * Sets up filter for showing only user's events
 */
const setupFilterListener = () => {
    const myEventsCheckbox = document.getElementById('myEventsOnly');
    if (!myEventsCheckbox) {
        console.error('[ERROR] My events checkbox not found');
        return;
    }
    myEventsCheckbox.addEventListener('change', () => {
        const isChecked = myEventsCheckbox.checked;
        filterEvents(isChecked);
    });
};
/**
 * Filters events to show only the current user's events
 * @param showOnlyMyEvents Boolean indicating whether to show only current user's events
 */
const filterEvents = (showOnlyMyEvents) => {
    const rows = document.querySelectorAll('#plannedEventsTableBody tr');
    const currentUser = getCurrentUserName();
    const noEventsMessage = document.getElementById('noEventsMessage');
    let visibleRowCount = 0;
    rows.forEach((row) => {
        // Cast row to HTMLTableRowElement to access cells property
        const typedRow = row;
        const organizerCell = typedRow.cells[4];
        const organizer = organizerCell.textContent;
        if (showOnlyMyEvents && organizer !== currentUser) {
            row.style.display = 'none';
        }
        else {
            row.style.display = '';
            visibleRowCount++;
        }
    });
    // Show or hide the no events message
    if (noEventsMessage) {
        if (visibleRowCount === 0) {
            noEventsMessage.classList.remove('d-none');
        }
        else {
            noEventsMessage.classList.add('d-none');
        }
    }
};
/**
 * Handles clicking the view event button
 * @param e Click event
 */
const handleViewEvent = (e) => {
    const button = e.currentTarget;
    const eventId = button.getAttribute('data-event-id');
    if (!eventId) {
        console.error('[ERROR] Event ID not found on button');
        return;
    }
    // Find the event
    const event = getEventById(eventId);
    if (!event) {
        console.error('[ERROR] Event not found with ID:', eventId);
        return;
    }
    // Populate and show the modal
    const modalTitle = document.getElementById('eventDetailsTitle');
    const modalBody = document.getElementById('eventDetailsBody');
    if (modalTitle && modalBody) {
        modalTitle.textContent = event.name;
        modalBody.innerHTML = `
            <p><strong>Date:</strong> ${formatDate(event.date)}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Organizer:</strong> ${event.organizer}</p>
            <p><strong>Description:</strong></p>
            <p>${event.description}</p>
        `;
        // Show the modal using Bootstrap
        // @ts-ignore - Bootstrap is loaded globally
        const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
        modal.show();
    }
};
/**
 * Handles clicking the delete event button
 * @param e Click event
 */
const handleDeleteEvent = (e) => {
    var _a;
    const button = e.currentTarget;
    const eventId = button.getAttribute('data-event-id');
    if (!eventId) {
        console.error('[ERROR] Event ID not found on button');
        return;
    }
    // Set up the delete confirmation button
    const confirmButton = document.getElementById('confirmDeleteButton');
    if (confirmButton) {
        // Remove any existing event listeners
        const newConfirmButton = confirmButton.cloneNode(true);
        (_a = confirmButton.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(newConfirmButton, confirmButton);
        // Add new event listener with the current event ID
        newConfirmButton.addEventListener('click', () => {
            deleteEvent(eventId);
            // Hide the modal
            // @ts-ignore - Bootstrap is loaded globally
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteEventModal'));
            // @ts-ignore
            modal.hide();
            // Reload events list
            loadPlannedEvents();
        });
    }
    // Show the delete confirmation modal
    // @ts-ignore - Bootstrap is loaded globally
    const modal = new bootstrap.Modal(document.getElementById('deleteEventModal'));
    modal.show();
};
/**
 * Validates the event form
 * @returns Array of validation errors, empty if valid
 */
const validateEventForm = () => {
    const errors = [];
    const nameInput = document.getElementById('eventName');
    const dateInput = document.getElementById('eventDate');
    const timeInput = document.getElementById('eventTime');
    const locationInput = document.getElementById('eventLocation');
    const descriptionInput = document.getElementById('eventDescription');
    // Validate name
    if (!nameInput.value.trim()) {
        errors.push({ field: 'eventName', message: 'Event name is required' });
    }
    else if (nameInput.value.length < 5) {
        errors.push({ field: 'eventName', message: 'Event name must be at least 5 characters' });
    }
    // Validate date
    if (!dateInput.value) {
        errors.push({ field: 'eventDate', message: 'Date is required' });
    }
    else {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            errors.push({ field: 'eventDate', message: 'Date cannot be in the past' });
        }
    }
    // Validate time
    if (!timeInput.value) {
        errors.push({ field: 'eventTime', message: 'Time is required' });
    }
    // Validate location
    if (!locationInput.value.trim()) {
        errors.push({ field: 'eventLocation', message: 'Location is required' });
    }
    // Validate description
    if (!descriptionInput.value.trim()) {
        errors.push({ field: 'eventDescription', message: 'Description is required' });
    }
    else if (descriptionInput.value.length < 20) {
        errors.push({ field: 'eventDescription', message: 'Description must be at least 20 characters' });
    }
    return errors;
};
/**
 * Displays validation errors on the form
 * @param errors Array of validation errors
 */
const displayValidationErrors = (errors) => {
    // Clear all previous errors
    const errorElements = document.querySelectorAll('.invalid-feedback');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.classList.remove('is-invalid');
    });
    // Display new errors
    errors.forEach(error => {
        const input = document.getElementById(error.field);
        const errorElement = document.getElementById(`${error.field}Error`);
        if (input && errorElement) {
            input.classList.add('is-invalid');
            errorElement.textContent = error.message;
        }
    });
};
/**
 * Gets all planned events from local storage
 * @returns Array of planned events
 */
const getPlannedEvents = () => {
    const eventsJson = localStorage.getItem('plannedEvents');
    return eventsJson ? JSON.parse(eventsJson) : [];
};
/**
 * Gets an event by its ID
 * @param id Event ID
 * @returns Event object or null if not found
 */
const getEventById = (id) => {
    const events = getPlannedEvents();
    return events.find(event => event.id === id) || null;
};
/**
 * Saves a new event to local storage
 * @param event Event to save
 */
const saveEvent = (event) => {
    const events = getPlannedEvents();
    events.push(event);
    localStorage.setItem('plannedEvents', JSON.stringify(events));
};
/**
 * Deletes an event from local storage
 * @param id ID of event to delete
 */
const deleteEvent = (id) => {
    const events = getPlannedEvents();
    const updatedEvents = events.filter(event => event.id !== id);
    localStorage.setItem('plannedEvents', JSON.stringify(updatedEvents));
};
/**
 * Generates a unique ID for a new event
 * @returns Unique ID string
 */
const generateEventId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
/**
 * Gets the current user's display name
 * @returns Current user's name or "Unknown User"
 */
const getCurrentUserName = () => {
    const userJson = sessionStorage.getItem('user');
    if (!userJson) {
        return 'Unknown User';
    }
    try {
        const user = JSON.parse(userJson);
        return user.DisplayName || 'Unknown User';
    }
    catch (error) {
        console.error('[ERROR] Failed to parse user data:', error);
        return 'Unknown User';
    }
};
/**
 * Formats a date string from YYYY-MM-DD to a more readable format
 * @param dateStr Date string in YYYY-MM-DD format
 * @returns Formatted date string
 */
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
export default { renderEventPlanningPage, initEventPlanningPage };
//# sourceMappingURL=event-planning.js.map