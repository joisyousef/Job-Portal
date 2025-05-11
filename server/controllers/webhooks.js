import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User With Database
export const clerkWebhook = async (req, res) => {
  try {
    // Create a Svix instance with webhook secret
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    // Verifying Headers
    await webhook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
    // Getting Data from request body
    const { data, type } = req.body;

    // Switch Cases for different events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_address[0].email_add,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        };
        await User.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_address[0].email_add,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id.userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: flase, message: "Webhooks Error" });
  }
};
