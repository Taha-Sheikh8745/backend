import express from "express";
import { submitContactForm } from "../Controllers/ContactController.js";

const ContactRouter = express.Router();

// Public route to submit the form
ContactRouter.post("/submit", submitContactForm);

export default ContactRouter;
