import express from "express";
import { getAllUsers, toggleUserStatus } from "../Controllers/AdminController.js";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../Controllers/CategoryController.js";
import { getAllSubmissions, deleteSubmission } from "../Controllers/ContactController.js";
import authUser from "../Middleware/Authuser.js";
import adminAuth from "../Middleware/AdminMiddleware.js";

const AdminRouter = express.Router();

// Temporarily disabled protection for testing as requested
// AdminRouter.use(authUser, adminAuth);

// User Management Routes
AdminRouter.get("/users", getAllUsers);
AdminRouter.patch("/users/:id/status", toggleUserStatus);

// Category Management Routes
AdminRouter.post("/categories", createCategory);
AdminRouter.get("/categories", getCategories);
AdminRouter.put("/categories/:id", updateCategory);
AdminRouter.delete("/categories/:id", deleteCategory);

// Contact Submission Management
AdminRouter.get("/contact-submissions", getAllSubmissions);
AdminRouter.delete("/contact-submissions/:id", deleteSubmission);

export default AdminRouter;
