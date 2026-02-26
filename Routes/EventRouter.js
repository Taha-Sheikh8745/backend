import express from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../Controllers/EventController.js';
import upload from '../Middleware/Multer.js'; // Adjust path if needed

const router = express.Router();

// Routes
router.post('/add', upload.array('images', 10), createEvent); // Allow up to 10 images, min 5 enforced in controller
router.get('/get', getEvents);
router.get('/get/:id', getEventById);
router.put('/update/:id', upload.array('images', 10), updateEvent);
router.delete('/delete/:id', deleteEvent);

export default router;
