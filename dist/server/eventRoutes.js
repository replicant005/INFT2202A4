"use strict";
import express from "express";
import Database from "./database.js";
// Express router
const router = express.Router();
/**
 * Handles GET request to retrieve all events
 */
router.get('/', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const events = await db.collection("events").find().toArray();
        res.json(events);
    }
    catch (error) {
        console.error("[ERROR] Failed to fetch events: ", error);
        res.status(500).json({ message: "Server connection error" });
    }
});
/**
 * Handles GET request to retrieve events for a specific organizer
 */
router.get('/organizer/:organizer', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const events = await db.collection("events")
            .find({ organizer: req.params.organizer })
            .toArray();
        res.json(events);
    }
    catch (error) {
        console.error("[ERROR] Failed to fetch organizer's events: ", error);
        res.status(500).json({ message: "Server connection error" });
    }
});
/**
 * Handles GET request to retrieve a single event by id
 */
router.get('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const event = await db.collection("events").findOne({ id: req.params.id });
        if (event) {
            res.json(event);
        }
        else {
            res.status(404).json({ message: "Event not found" });
        }
    }
    catch (error) {
        console.error("[ERROR] Failed to fetch event: ", error);
        res.status(500).json({ message: "Server connection error" });
    }
});
/**
 * Creates a new event
 */
router.post('/', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        // Validate required fields
        if (!req.body.name || !req.body.date || !req.body.time ||
            !req.body.location || !req.body.description || !req.body.organizer) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Create new event
        const newEvent = {
            id: generateEventId(),
            name: req.body.name,
            date: req.body.date,
            time: req.body.time,
            location: req.body.location,
            description: req.body.description,
            organizer: req.body.organizer
        };
        await db.collection("events").insertOne(newEvent);
        res.status(201).json(newEvent);
    }
    catch (error) {
        console.error("[ERROR] Failed to create event: ", error);
        res.status(500).json({ message: "Server connection error" });
    }
});
/**
 * Updates an existing event
 */
router.put('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const { ...updateData } = req.body;
        // Don't allow changing the organizer or ID
        if (updateData.organizer || updateData.id) {
            return res.status(400).json({ message: "Cannot change organizer or ID" });
        }
        const result = await db.collection("events")
            .findOneAndUpdate({ id: req.params.id }, { $set: updateData }, { returnDocument: 'after' });
        if (result && result.value) {
            res.json(result.value);
        }
        else {
            const updatedEvent = await db.collection("events").findOne({ id: req.params.id });
            if (updatedEvent) {
                res.json(updatedEvent);
            }
            else {
                res.status(404).json({ message: "Event not found" });
            }
        }
    }
    catch (error) {
        console.error("[ERROR] Failed to update event: ", error);
        res.status(500).json({ message: "Server connection error" });
    }
});
/**
 * Deletes an event
 */
router.delete('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const result = await db.collection("events").deleteOne({ id: req.params.id });
        if (result.deletedCount > 0) {
            res.json({ message: "Event deleted successfully." });
        }
        else {
            res.status(404).json({ message: "Event not found" });
        }
    }
    catch (error) {
        console.error("[ERROR] Failed to delete event: ", error);
        res.status(500).json({ message: "Server connection error" });
    }
});
/**
 * Generates a unique ID for a new event
 */
function generateEventId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
export default router;
//# sourceMappingURL=eventRoutes.js.map