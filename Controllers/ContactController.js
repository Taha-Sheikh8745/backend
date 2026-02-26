import Contact from "../Models/ContactSchema.js";

/* ================= SUBMIT CONTACT FORM ================= */
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, eventDate, eventType, message } = req.body;

        if (!name || !email || !phone || !eventType || !message) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        const newSubmission = await Contact.create({
            name,
            email,
            phone,
            eventDate,
            eventType,
            message
        });

        res.status(201).json({
            success: true,
            message: "Form submitted successfully",
            data: newSubmission,
        });
    } catch (error) {
        console.error("Submit contact form error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ================= GET ALL SUBMISSIONS ================= */
export const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Contact.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        console.error("Get submissions error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ================= DELETE SUBMISSION ================= */
export const deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;

        const submission = await Contact.findByIdAndDelete(id);
        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        res.json({
            success: true,
            message: "Submission deleted successfully",
        });
    } catch (error) {
        console.error("Delete submission error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
