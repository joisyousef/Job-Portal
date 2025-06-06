import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhook = async (req, res) => {
  try {
    // Debug logging
    console.log("=== CLERK WEBHOOK DEBUG ===");
    console.log("Headers:", req.headers);
    console.log("Body type:", typeof req.body);
    console.log("Body:", req.body);
    console.log("Environment variables check:");
    console.log(
      "CLERK_WEBHOOK_SECRET exists:",
      !!process.env.CLERK_WEBHOOK_SECRET
    );
    console.log(
      "CLERK_WEBHOOK_SECRET length:",
      process.env.CLERK_WEBHOOK_SECRET?.length
    );

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Handle raw body properly - this is crucial for webhook verification
    let payload;
    if (typeof req.body === "string") {
      payload = req.body;
    } else if (Buffer.isBuffer(req.body)) {
      payload = req.body.toString();
    } else {
      payload = JSON.stringify(req.body);
    }

    console.log("Payload for verification:", payload.substring(0, 100) + "...");

    // Verify webhook signature
    await wh.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log("✅ Webhook verification successful");

    // Parse body if it's a string
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { data, type } = body;

    console.log("Event type:", type);
    console.log("User data:", {
      id: data.id,
      email_addresses: data.email_addresses,
      first_name: data.first_name,
      last_name: data.last_name,
      image_url: data.image_url,
    });

    // Fix 3: Better email extraction with fallback
    const email =
      data.email_addresses?.[0]?.email_address ||
      data.primary_email_address_id ||
      "";

    console.log(`Processing webhook event: ${type} for user: ${data.id}`);

    switch (type) {
      case "user.created":
        try {
          // Fix 4: Check if user already exists to prevent duplicates
          const existingUser = await User.findById(data.id);
          if (existingUser) {
            console.log(`User ${data.id} already exists, skipping creation`);
            return res.json({ success: true, message: "User already exists" });
          }

          const newUser = await User.create({
            _id: data.id,
            email,
            name:
              `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
              "Unknown User",
            Image: data.image_url || "", // Fix 5: Handle case sensitivity (Image vs image)
            resume: "",
          });

          console.log(`User created successfully: ${newUser._id}`);
          return res.json({
            success: true,
            message: "User created successfully",
          });
        } catch (createError) {
          console.error("Error creating user:", createError);
          // Check if it's a duplicate key error
          if (createError.code === 11000) {
            return res.json({ success: true, message: "User already exists" });
          }
          throw createError;
        }

      case "user.updated":
        try {
          const updatedUser = await User.findByIdAndUpdate(
            data.id,
            {
              email,
              name:
                `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
                "Unknown User",
              Image: data.image_url || "",
            },
            { new: true, runValidators: true, upsert: false }
          );

          if (!updatedUser) {
            console.log(`User ${data.id} not found for update`);
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }

          console.log(`User updated successfully: ${updatedUser._id}`);
          return res.json({
            success: true,
            message: "User updated successfully",
          });
        } catch (updateError) {
          console.error("Error updating user:", updateError);
          throw updateError;
        }

      case "user.deleted":
        try {
          const deletedUser = await User.findByIdAndDelete(data.id);
          if (!deletedUser) {
            console.log(`User ${data.id} not found for deletion`);
          }
          console.log(`User deleted: ${data.id}`);
          return res.json({
            success: true,
            message: "User deleted successfully",
          });
        } catch (deleteError) {
          console.error("Error deleting user:", deleteError);
          throw deleteError;
        }

      default:
        console.log(`Unhandled event type: ${type}`);
        return res.status(400).json({ error: "Unhandled event type" });
    }
  } catch (err) {
    console.error("Clerk webhook error:", err);

    // More detailed error logging
    if (err.name === "ValidationError") {
      console.error("Validation errors:", err.errors);
    }

    return res.status(500).json({
      success: false,
      message: err.message,
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};
