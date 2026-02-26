import Event from "../Models/EventSchema.js";
import cloudinary from "../Utils/Cloudinary.js";

/* ================= CREATE EVENT ================= */
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, place, guest, categoryid } = req.body;
        const imageFiles = req.files;

        if (!imageFiles || imageFiles.length < 5) {
            return res.status(400).json({ success: false, message: "At least 5 images are required." });
        }

        // Upload images to Cloudinary
        const imageUrls = [];
        for (const file of imageFiles) {
            // Check if file.buffer exists (using memory storage)
            if (!file.buffer) {
                console.error("File buffer is missing");
                continue;
            }

            // Convert buffer to base64 string for upload
            const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

            try {
                const uploadResponse = await cloudinary.uploader.upload(fileStr, {
                    folder: "events",
                    resource_type: "auto",
                });
                imageUrls.push(uploadResponse.secure_url);
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                // Consider whether to abort the whole process or just skip the failed image
                // For critical image requirements, aborting might be safer to maintain consistency
            }
        }

        if (imageUrls.length < 5) {
            return res.status(500).json({ success: false, message: "Failed to upload required amount of images." });
        }


        const newEvent = await Event.create({
            title,
            description,
            date,
            place,
            guest,
            images: imageUrls,
            categoryid,
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: newEvent,
        });
    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/* ================= GET ALL EVENTS ================= */
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("categoryid", "categoryName").sort({ createdAt: -1 });

        res.json({
            success: true,
            data: events,
        });
    } catch (error) {
        console.error("Get events error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ================= GET EVENT BY ID ================= */
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate("categoryid", "categoryName");

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        res.json({
            success: true,
            data: event,
        });
    } catch (error) {
        console.error("Get event by ID error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ================= UPDATE EVENT ================= */
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, place, guest, categoryid } = req.body;
        const imageFiles = req.files;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Update fields if provided
        if (title) event.title = title;
        if (description) event.description = description;
        if (date) event.date = date;
        if (place) event.place = place;
        if (guest) event.guest = guest;
        if (categoryid) event.categoryid = categoryid;

        // If new images are uploaded, handle them
        if (imageFiles && imageFiles.length > 0) {
            if (imageFiles.length < 5) {
                return res.status(400).json({ success: false, message: "If updating images, you must provide at least 5 new images." });
            }

            const imageUrls = [];
            for (const file of imageFiles) {
                if (!file.buffer) continue;
                const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

                try {
                    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
                        folder: "events",
                        resource_type: "auto",
                    });
                    imageUrls.push(uploadResponse.secure_url);
                } catch (uploadError) {
                    console.error("Cloudinary upload error during update:", uploadError);
                }
            }
            if (imageUrls.length >= 5) {
                event.images = imageUrls; // Replace existing images with new ones
            } else {
                return res.status(500).json({ success: false, message: "Failed to upload required amount of images for update." });
            }
        }

        await event.save();

        res.json({
            success: true,
            message: "Event updated successfully",
            data: event,
        });
    } catch (error) {
        console.error("Update event error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ================= DELETE EVENT ================= */
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Optional: Delete images from Cloudinary
        // This requires extracting public_id from secure_url, which might be complex if not stored separately
        // For now, we will just delete the database record.

        res.json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        console.error("Delete event error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
