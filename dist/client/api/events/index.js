/**
 * Fetches all events from the server
 */
export async function fetchEvents() {
    const response = await fetch('/api/events/');
    if (!response.ok)
        throw new Error(`Failed to fetch events: ${response.statusText}`);
    return await response.json();
}
/**
 * Fetches events for a specific organizer
 */
export async function fetchOrganizerEvents(organizer) {
    const response = await fetch(`/api/events/organizer/${organizer}`);
    if (!response.ok)
        throw new Error(`Failed to fetch organizer's events: ${response.statusText}`);
    return await response.json();
}
/**
 * Fetches a single event by ID
 */
export async function fetchEvent(id) {
    const response = await fetch(`/api/events/${id}`);
    if (!response.ok)
        throw new Error(`Failed to fetch event: ${response.statusText}`);
    return await response.json();
}
/**
 * Creates a new event
 */
export async function createEvent(event) {
    const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    });
    if (!response.ok)
        throw new Error(`Failed to create event: ${response.statusText}`);
    return await response.json();
}
/**
 * Updates an existing event
 */
export async function updateEvent(id, event) {
    const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    });
    if (!response.ok)
        throw new Error(`Failed to update event: ${response.statusText}`);
    return await response.json();
}
/**
 * Deletes an event
 */
export async function deleteEvent(id) {
    const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok)
        throw new Error(`Failed to delete event: ${response.statusText}`);
}
//# sourceMappingURL=index.js.map